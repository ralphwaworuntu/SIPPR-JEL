import * as dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

async function migrate() {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);
    
    // Check which columns are missing and add them
    const [rows] = await connection.query(`SHOW COLUMNS FROM congregants`);
    const existingColumns = (rows as any[]).map((r: any) => r.Field);
    
    console.log("Existing columns count:", existingColumns.length);
    
    const columnsToAdd: [string, string][] = [
        ["family_members_non_sidi", "INT DEFAULT NULL"],
        ["family_members_non_sidi_names", "JSON DEFAULT NULL"],
        ["family_members_non_baptized_names", "JSON DEFAULT NULL"],
    ];
    
    for (const [col, type] of columnsToAdd) {
        if (!existingColumns.includes(col)) {
            console.log(`Adding missing column: ${col}`);
            await connection.query(`ALTER TABLE congregants ADD COLUMN \`${col}\` ${type}`);
            console.log(`  ✓ Added ${col}`);
        } else {
            console.log(`Column ${col} already exists, skipping.`);
        }
    }
    
    console.log("\nMigration complete!");
    await connection.end();
}

migrate().catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});
