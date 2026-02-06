
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

// Parse URL manually or just hardcode based on .env content for this task
// env: DATABASE_URL=mysql://root:@localhost:3306/sdm_gmit
const dbName = 'sdm_gmit';

async function createDb() {
    console.log("Connecting to MySQL server...");
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3306
    });

    console.log(`Creating database ${dbName} if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log("Database created or already exists.");

    await connection.end();
}

createDb().catch((err) => {
    console.error("Failed to create DB:", err);
    process.exit(1);
});
