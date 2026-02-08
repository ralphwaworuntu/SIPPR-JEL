
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sdm_gmit'
};

async function inspectAndTest() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to database.");

        const [columns]: any = await connection.query("DESCRIBE congregants");
        console.log("--- Schema Inspection ---");
        columns.forEach((col: any) => {
            console.log(`${col.Field}: ${col.Type} (${col.Null === 'YES' ? 'Null' : 'Not Null'})`);
        });

        console.log("\n--- Testing Insertion ---");
        const testData = {
            full_name: "Diagnostic Test",
            gender: "Laki-laki",
            date_of_birth: "1990-01-01",
            phone: "0812345",
            address: "Test Address",
            sector: "Pemuda",
            lingkungan: "1",
            rayon: "1",
            education_level: "S1",
            major: "Computer Science",
            job_category: "TI",
            job_title: "Dev",
            company_name: "GMIT",
            years_of_experience: 1,
            skills: JSON.stringify(["coding"]),
            willingness_to_serve: "Aktif",
            interest_areas: JSON.stringify(["Tech"]),
            contribution_types: JSON.stringify(["Expert"]),
            latitude: "-10.1234567890123456789012345678901234567890", // Long string test
            longitude: "123.1234567890123456789012345678901234567890",
            status: 'PENDING'
        };

        const keys = Object.keys(testData);
        const values = Object.values(testData);
        const placeholders = keys.map(() => "?").join(", ");
        const query = `INSERT INTO congregants (${keys.join(", ")}) VALUES (${placeholders})`;

        await connection.execute(query, values);
        console.log("Insertion successful!");

    } catch (error: any) {
        console.error("Diagnostic ERROR:", error.message);
        if (error.code) console.error("Error Code:", error.code);
    } finally {
        if (connection) await connection.end();
    }
}

inspectAndTest();
