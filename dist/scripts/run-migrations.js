"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
async function main() {
    await database_1.AppDataSource.initialize();
    try {
        const migrations = await database_1.AppDataSource.runMigrations();
        console.log(`Migrations executed: ${migrations.length}`);
        migrations.forEach((m) => console.log(m.name));
    }
    finally {
        if (database_1.AppDataSource.isInitialized) {
            await database_1.AppDataSource.destroy();
        }
    }
}
main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
});
//# sourceMappingURL=run-migrations.js.map