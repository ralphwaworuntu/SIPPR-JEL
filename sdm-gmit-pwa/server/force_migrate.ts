
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sdm_gmit'
};

async function forceMigrate() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to database for force migration.");

        const commands = [
            "ALTER TABLE congregants MODIFY COLUMN willingness_to_serve VARCHAR(50)",
            "ALTER TABLE congregants ADD COLUMN major VARCHAR(100) AFTER education_level",
            "ALTER TABLE congregants ADD COLUMN job_title VARCHAR(100) AFTER job_category",
            "ALTER TABLE congregants ADD COLUMN company_name VARCHAR(150) AFTER job_title",
            "ALTER TABLE congregants ADD COLUMN years_of_experience INT DEFAULT 0 AFTER company_name",
            "ALTER TABLE congregants ADD COLUMN interest_areas JSON AFTER willingness_to_serve",
            "ALTER TABLE congregants ADD COLUMN contribution_types JSON AFTER interest_areas",
            "ALTER TABLE congregants ADD COLUMN latitude VARCHAR(50) AFTER contribution_types",
            "ALTER TABLE congregants ADD COLUMN longitude VARCHAR(50) AFTER latitude"
        ];

        for (const cmd of commands) {
            try {
                console.log(`Executing: ${cmd}`);
                const [result] = await connection.query(cmd);
                console.log("Success:", result);
            } catch (err: any) {
                if (err.code === 'ER_DUP_COLUMN_NAME' || err.message.includes('Duplicate column name')) {
                    console.log("Already exists, skipping.");
                } else {
                    console.error("FAILED cmd:", cmd);
                    console.error("Error Message:", err.message);
                    console.error("Error Code:", err.code);
                }
            }
        }

        console.log("\n--- Final Check ---");
        const [columns]: any = await connection.query("DESCRIBE congregants");
        columns.forEach((col: any) => {
            console.log(`${col.Field}: ${col.Type}`);
        });

    } catch (error: any) {
        console.error("Fatal Migration Error:", error.message);
    } finally {
        if (connection) await connection.end();
    }
}

forceMigrate();
