
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const dbName = 'sdm_gmit';

async function seedDb() {
    console.log("Connecting to MySQL server...");
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: dbName,
        port: 3306
    });

    console.log("Seeding data...");

    const congregants = [
        ['John Doe', 'Laki-laki', '1985-05-15', 'Efata', 'S2', 'Senior Developer', '["Python", "SQL"]', 1, 'Sidi', 'PENDING'],
        ['Jane Smith', 'Perempuan', '1992-10-20', 'Betel', 'S1', 'Perawat', '["P3K", "Anak"]', 0, 'Sidi', 'PENDING']
    ];

    const query = `
        INSERT INTO congregants 
        (full_name, gender, date_of_birth, sector, education_level, job_category, skills, willingness_to_serve, status_gerejawi, status) 
        VALUES ?
    `;

    // Flatten data for bulk insertion not needed for simple parameterized query if using pool.query usually, but for mysql2 execute/query with values array:
    // Actually simpler to just loop for this small seed
    for (const c of congregants) {
        await connection.execute(`
            INSERT INTO congregants 
            (full_name, gender, date_of_birth, sector, education_level, job_category, skills, willingness_to_serve, status_gerejawi, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, c);
    }

    console.log("Seeding completed.");
    await connection.end();
}

seedDb().catch((err) => {
    console.error("Failed to seed DB:", err);
    process.exit(1);
});
