import * as fs from 'fs';
import * as path from 'path';
import { AppDataSource } from '@/database';
import { LocalGovernmentArea } from '@/entities/lga.entity';
import { Ward } from '@/entities/ward.entity';
import { PollingUnit } from '@/entities/polling-unit.entity';

type ImportRow = {
  lgaCode: string;
  lgaName: string;
  wardCode: string;
  wardName: string;
  pollingUnitCode: string;
  pollingUnitName: string;
  address: string;
  registeredVoters: number;
  lgaDescription?: string;
  wardDescription?: string;
};

type ImportStats = {
  lgasCreated: number;
  lgasUpdated: number;
  wardsCreated: number;
  wardsUpdated: number;
  pollingUnitsCreated: number;
  pollingUnitsUpdated: number;
};

const REQUIRED_HEADERS = [
  'lga_code',
  'lga_name',
  'ward_code',
  'ward_name',
  'polling_unit_code',
  'polling_unit_name',
  'address',
];

function getArgValue(name: string): string | undefined {
  const arg = process.argv.find((item) => item.startsWith(`${name}=`));
  if (arg) {
    return arg.slice(name.length + 1);
  }

  const index = process.argv.indexOf(name);
  if (index >= 0) {
    return process.argv[index + 1];
  }

  return undefined;
}

function hasFlag(name: string): boolean {
  return process.argv.includes(name);
}

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/[\s-]+/g, '_');
}

function normalizeValue(value: string | undefined): string {
  return (value || '').trim();
}

function parseCsv(content: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentValue = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentValue += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      currentRow.push(currentValue);
      currentValue = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i += 1;
      }

      currentRow.push(currentValue);
      if (currentRow.some((cell) => cell.trim() !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentValue = '';
      continue;
    }

    currentValue += char;
  }

  if (currentValue.length > 0 || currentRow.length > 0) {
    currentRow.push(currentValue);
    if (currentRow.some((cell) => cell.trim() !== '')) {
      rows.push(currentRow);
    }
  }

  return rows;
}

function mapRow(headers: string[], row: string[], rowNumber: number): ImportRow {
  const get = (header: string) => normalizeValue(row[headers.indexOf(header)]);
  const missingHeaders = REQUIRED_HEADERS.filter((header) => !headers.includes(header));

  if (missingHeaders.length > 0) {
    throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
  }

  const mapped: ImportRow = {
    lgaCode: get('lga_code'),
    lgaName: get('lga_name'),
    wardCode: get('ward_code'),
    wardName: get('ward_name'),
    pollingUnitCode: get('polling_unit_code'),
    pollingUnitName: get('polling_unit_name'),
    address: get('address'),
    registeredVoters: Number.parseInt(get('registered_voters') || '0', 10) || 0,
    lgaDescription: get('lga_description') || undefined,
    wardDescription: get('ward_description') || undefined,
  };

  const requiredValues: Array<[keyof ImportRow, string]> = [
    ['lgaCode', 'lga_code'],
    ['lgaName', 'lga_name'],
    ['wardCode', 'ward_code'],
    ['wardName', 'ward_name'],
    ['pollingUnitCode', 'polling_unit_code'],
    ['pollingUnitName', 'polling_unit_name'],
    ['address', 'address'],
  ];

  for (const [key, label] of requiredValues) {
    if (!mapped[key]) {
      throw new Error(`Row ${rowNumber}: ${label} is required`);
    }
  }

  return mapped;
}

async function main() {
  const fileArg = getArgValue('--file');
  if (!fileArg) {
    throw new Error(
      'Missing --file argument. Example: npm run import:locations -- --file .\\data\\kano-locations.csv',
    );
  }

  const csvPath = path.resolve(process.cwd(), fileArg);
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found: ${csvPath}`);
  }

  const replaceExisting = hasFlag('--replace');
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const parsedRows = parseCsv(csvContent);

  if (parsedRows.length < 2) {
    throw new Error('CSV must include a header row and at least one data row');
  }

  const headers = parsedRows[0].map(normalizeHeader);
  const dataRows = parsedRows.slice(1).map((row, index) => mapRow(headers, row, index + 2));

  await AppDataSource.initialize();

  const lgaRepository = AppDataSource.getRepository(LocalGovernmentArea);
  const wardRepository = AppDataSource.getRepository(Ward);
  const pollingUnitRepository = AppDataSource.getRepository(PollingUnit);

  const stats: ImportStats = {
    lgasCreated: 0,
    lgasUpdated: 0,
    wardsCreated: 0,
    wardsUpdated: 0,
    pollingUnitsCreated: 0,
    pollingUnitsUpdated: 0,
  };

  try {
    if (replaceExisting) {
      console.log('Replacing existing location data...');
      await pollingUnitRepository.createQueryBuilder().delete().from(PollingUnit).execute();
      await wardRepository.createQueryBuilder().delete().from(Ward).execute();
      await lgaRepository.createQueryBuilder().delete().from(LocalGovernmentArea).execute();
    }

    const lgaByCode = new Map(
      (await lgaRepository.find()).map((lga) => [lga.code.trim().toUpperCase(), lga]),
    );

    const wardByKey = new Map(
      (await wardRepository.find()).map((ward) => [
        `${ward.lgaId}:${ward.code.trim().toUpperCase()}`,
        ward,
      ]),
    );

    const pollingUnitByCode = new Map(
      (await pollingUnitRepository.find()).map((pu) => [pu.code.trim().toUpperCase(), pu]),
    );

    for (const row of dataRows) {
      const lgaCode = row.lgaCode.toUpperCase();
      let lga = lgaByCode.get(lgaCode);

      if (!lga) {
        lga = lgaRepository.create({
          code: lgaCode,
          name: row.lgaName,
          description: row.lgaDescription || undefined,
        });
        lga = await lgaRepository.save(lga);
        lgaByCode.set(lgaCode, lga);
        stats.lgasCreated += 1;
      } else if (lga.name !== row.lgaName || (row.lgaDescription && lga.description !== row.lgaDescription)) {
        lga.name = row.lgaName;
        lga.description = row.lgaDescription || lga.description;
        lga = await lgaRepository.save(lga);
        lgaByCode.set(lgaCode, lga);
        stats.lgasUpdated += 1;
      }

      const wardCode = row.wardCode.toUpperCase();
      const wardKey = `${lga.id}:${wardCode}`;
      let ward = wardByKey.get(wardKey);

      if (!ward) {
        ward = wardRepository.create({
          lgaId: lga.id,
          lga,
          code: wardCode,
          name: row.wardName,
          description: row.wardDescription || undefined,
        });
        ward = await wardRepository.save(ward);
        wardByKey.set(wardKey, ward);
        stats.wardsCreated += 1;
      } else if (ward.name !== row.wardName || (row.wardDescription && ward.description !== row.wardDescription)) {
        ward.name = row.wardName;
        ward.description = row.wardDescription || ward.description;
        ward = await wardRepository.save(ward);
        wardByKey.set(wardKey, ward);
        stats.wardsUpdated += 1;
      }

      const pollingUnitCode = row.pollingUnitCode.toUpperCase();
      let pollingUnit = pollingUnitByCode.get(pollingUnitCode);

      if (!pollingUnit) {
        pollingUnit = pollingUnitRepository.create({
          lgaId: lga.id,
          wardId: ward.id,
          lga,
          ward,
          code: pollingUnitCode,
          name: row.pollingUnitName,
          address: row.address,
          registeredVoters: row.registeredVoters,
        });
        pollingUnit = await pollingUnitRepository.save(pollingUnit);
        pollingUnitByCode.set(pollingUnitCode, pollingUnit);
        stats.pollingUnitsCreated += 1;
      } else {
        const shouldUpdate =
          pollingUnit.name !== row.pollingUnitName ||
          pollingUnit.address !== row.address ||
          pollingUnit.registeredVoters !== row.registeredVoters ||
          pollingUnit.lgaId !== lga.id ||
          pollingUnit.wardId !== ward.id;

        if (shouldUpdate) {
          pollingUnit.name = row.pollingUnitName;
          pollingUnit.address = row.address;
          pollingUnit.registeredVoters = row.registeredVoters;
          pollingUnit.lgaId = lga.id;
          pollingUnit.wardId = ward.id;
          pollingUnit.lga = lga;
          pollingUnit.ward = ward;
          pollingUnit = await pollingUnitRepository.save(pollingUnit);
          pollingUnitByCode.set(pollingUnitCode, pollingUnit);
          stats.pollingUnitsUpdated += 1;
        }
      }
    }

    console.log('Location import completed successfully.');
    console.log(JSON.stringify(stats, null, 2));
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
