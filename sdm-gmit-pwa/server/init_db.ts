
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const dbName = 'sdm_gmit';

async function initDb() {
    console.log("Connecting to MySQL server...");
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3306
    });

    console.log(`Creating database ${dbName} if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.changeUser({ database: dbName });

    console.log("Creating congregants table...");
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS congregants (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        gender VARCHAR(20),
        date_of_birth DATE,
        phone VARCHAR(20),
        sector VARCHAR(50),
        lingkungan VARCHAR(50),
        rayon VARCHAR(50),
        address TEXT,
        education_level VARCHAR(50),
        major VARCHAR(100),
        job_category VARCHAR(100),
        job_title VARCHAR(100),
        company_name VARCHAR(150),
        years_of_experience INT DEFAULT 0,
        skills JSON,
        willingness_to_serve VARCHAR(50),
        interest_areas JSON,
        contribution_types JSON,
        latitude VARCHAR(50),
        longitude VARCHAR(50),
        status VARCHAR(20) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
    `;
    await connection.query(createTableQuery);

    console.log("Tables created successfully.");
    await connection.end();
}

initDb().catch((err) => {
    console.error("Failed to init DB:", err);
    process.exit(1);
});
