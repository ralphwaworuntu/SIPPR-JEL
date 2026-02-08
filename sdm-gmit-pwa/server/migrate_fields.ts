
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

    console.log("Altering congregants table to add missing professional fields...");

    const alterQueries = [
        "ALTER TABLE congregants ADD COLUMN IF NOT EXISTS major VARCHAR(100) AFTER education_level",
        "ALTER TABLE congregants ADD COLUMN IF NOT EXISTS job_title VARCHAR(100) AFTER job_category",
        "ALTER TABLE congregants ADD COLUMN IF NOT EXISTS company_name VARCHAR(150) AFTER job_title",
        "ALTER TABLE congregants ADD COLUMN IF NOT EXISTS years_of_experience INT DEFAULT 0 AFTER company_name"
    ];

    for (const query of alterQueries) {
        try {
            await connection.query(query);
            console.log(`Executed: ${query}`);
        } catch (err: any) {
            if (err.code === 'ER_DUP_COLUMN_NAME') {
                console.log(`Column already exists, skipping.`);
            } else {
                throw err;
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
