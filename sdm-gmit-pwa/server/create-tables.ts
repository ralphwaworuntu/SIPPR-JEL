import { db } from "./db";
import { sql } from "drizzle-orm";

async function createTables() {
    try {
        console.log("Creating new tables...");

        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS enumerators (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                rayon VARCHAR(50) NOT NULL,
                lingkungan VARCHAR(50) NOT NULL,
                family_count INT DEFAULT 0,
                whatsapp VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
        console.log("enumerators table created.");

        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS pendamping (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                lingkungan VARCHAR(50) NOT NULL,
                family_count INT DEFAULT 0,
                enumerator_count INT DEFAULT 0,
                whatsapp VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
        console.log("pendamping table created.");

    } catch (e: any) {
        console.error("Failed to create tables:", e?.message || e);
    }
    process.exit(0);
}

createTables();
