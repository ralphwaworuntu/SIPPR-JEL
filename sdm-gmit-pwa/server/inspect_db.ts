
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
        console.log("--- Congregants Columns ---");
        const dbCols = columns.map((c: any) => c.Field);
        console.log(dbCols.join(", "));

        // Check for expected columns
        const expected = [
            "id", "full_name", "gender", "date_of_birth", "phone",
            "sector", "lingkungan", "rayon", "address",
            "education_level", "major", "job_category", "job_title", "company_name", "years_of_experience",
            "skills", "willingness_to_serve", "interest_areas", "contribution_types",
            "status", "created_at", "updated_at"
        ];

        const missing = expected.filter(c => !dbCols.includes(c));
        if (missing.length > 0) {
            console.error("MISSING COLUMNS:", missing);
        } else {
            console.log("All expected columns present.");
        }

    } catch (error: any) {
        console.error("Diagnostic ERROR:", error.message);
    } finally {
        if (connection) await connection.end();
    }
}

inspectAndTest();
