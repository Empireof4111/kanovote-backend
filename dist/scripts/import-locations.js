"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const database_1 = require("../database");
const lga_entity_1 = require("../entities/lga.entity");
const ward_entity_1 = require("../entities/ward.entity");
const polling_unit_entity_1 = require("../entities/polling-unit.entity");
const REQUIRED_HEADERS = [
    'lga_code',
    'lga_name',
    'ward_code',
    'ward_name',
    'polling_unit_code',
    'polling_unit_name',
    'address',
];
function getArgValue(name) {
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
function hasFlag(name) {
    return process.argv.includes(name);
}
function normalizeHeader(value) {
    return value.trim().toLowerCase().replace(/[\s-]+/g, '_');
}
function normalizeValue(value) {
    return (value || '').trim();
}
function parseCsv(content) {
    const rows = [];
    let currentRow = [];
    let currentValue = '';
    let inQuotes = false;
    for (let i = 0; i < content.length; i += 1) {
        const char = content[i];
        const nextChar = content[i + 1];
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentValue += '"';
                i += 1;
            }
            else {
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
function mapRow(headers, row, rowNumber) {
    const get = (header) => normalizeValue(row[headers.indexOf(header)]);
    const missingHeaders = REQUIRED_HEADERS.filter((header) => !headers.includes(header));
    if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }
    const mapped = {
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
    const requiredValues = [
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
        throw new Error('Missing --file argument. Example: npm run import:locations -- --file .\\data\\kano-locations.csv');
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
    await database_1.AppDataSource.initialize();
    const lgaRepository = database_1.AppDataSource.getRepository(lga_entity_1.LocalGovernmentArea);
    const wardRepository = database_1.AppDataSource.getRepository(ward_entity_1.Ward);
    const pollingUnitRepository = database_1.AppDataSource.getRepository(polling_unit_entity_1.PollingUnit);
    const stats = {
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
            await pollingUnitRepository.createQueryBuilder().delete().from(polling_unit_entity_1.PollingUnit).execute();
            await wardRepository.createQueryBuilder().delete().from(ward_entity_1.Ward).execute();
            await lgaRepository.createQueryBuilder().delete().from(lga_entity_1.LocalGovernmentArea).execute();
        }
        const lgaByCode = new Map((await lgaRepository.find()).map((lga) => [lga.code.trim().toUpperCase(), lga]));
        const wardByKey = new Map((await wardRepository.find()).map((ward) => [
            `${ward.lgaId}:${ward.code.trim().toUpperCase()}`,
            ward,
        ]));
        const pollingUnitByCode = new Map((await pollingUnitRepository.find()).map((pu) => [pu.code.trim().toUpperCase(), pu]));
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
            }
            else if (lga.name !== row.lgaName || (row.lgaDescription && lga.description !== row.lgaDescription)) {
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
            }
            else if (ward.name !== row.wardName || (row.wardDescription && ward.description !== row.wardDescription)) {
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
            }
            else {
                const shouldUpdate = pollingUnit.name !== row.pollingUnitName ||
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
    }
    finally {
        if (database_1.AppDataSource.isInitialized) {
            await database_1.AppDataSource.destroy();
        }
    }
}
main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
//# sourceMappingURL=import-locations.js.map