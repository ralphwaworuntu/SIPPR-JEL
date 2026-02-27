import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

async function run() {
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    try {
        await conn.query(`ALTER TABLE user ADD COLUMN role varchar(20) DEFAULT 'admin'`);
        console.log("Column 'role' added successfully");
    } catch (err: any) {
        if (err.code === "ER_DUP_FIELDNAME") {
            console.log("Column 'role' already exists");
        } else {
            console.error("Error adding column:", err);
        }
    }
    await conn.end();
}

run();
