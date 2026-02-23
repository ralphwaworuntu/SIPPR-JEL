
import { db } from "./db";
import { sql } from "drizzle-orm";

async function checkTables() {
    try {
        const [tables] = await db.execute(sql`SHOW TABLES`);
        console.log("Tables in database:", JSON.stringify(tables, null, 2));
    } catch (error) {
        console.error("Failed to list tables:", error);
    } finally {
        process.exit();
    }
}

checkTables();
