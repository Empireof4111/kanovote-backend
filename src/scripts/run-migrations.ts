import { AppDataSource } from '@/database';

async function main() {
  await AppDataSource.initialize();

  try {
    const migrations = await AppDataSource.runMigrations();
    console.log(`Migrations executed: ${migrations.length}`);
    migrations.forEach((m) => console.log(m.name));
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
