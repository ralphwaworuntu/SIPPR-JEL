
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const dbName = 'sdm_gmit';

async function migrate() {
    console.log("Connecting to MySQL server...");
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3306,
        database: dbName
    });

    console.log("Altering congregants table for comprehensive fields...");

    // 1. Change willingness_to_serve from boolean to varchar
    try {
        await connection.query("ALTER TABLE congregants MODIFY COLUMN willingness_to_serve VARCHAR(50)");
        console.log("Updated willingness_to_serve column type.");
    } catch (err) {
        console.error("Failed to modify willingness_to_serve:", err);
    }

    // 2. Add new columns
    const alterQueries = [
        "ALTER TABLE congregants ADD COLUMN IF NOT EXISTS interest_areas JSON AFTER willingness_to_serve",
        "ALTER TABLE congregants ADD COLUMN IF NOT EXISTS contribution_types JSON AFTER interest_areas",
    ];

    for (const query of alterQueries) {
        try {
            await connection.query(query);
            console.log(`Executed: ${query}`);
        } catch (err: any) {
            if (err.code === 'ER_DUP_COLUMN_NAME') {
                console.log(`Column already exists, skipping.`);
            } else {
                console.error(`Error executing ${query}:`, err);
            }
        }
    }

    console.log("Migration completed successfully.");
    await connection.end();
}

migrate().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
});
