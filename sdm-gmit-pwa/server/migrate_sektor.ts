/**
 * Migration Script: Convert old sector names to Sektor Kategorial
 * 
 * This script updates existing records that have geographic sector names
 * to use the new Sektor Kategorial system based on reasonable defaults.
 * 
 * Mapping:
 * - Efata, Betel, Sion, Eden, Sektor X -> Will be set based on age if available, else "Pemuda"
 */

import { db } from "./db";
import { congregants } from "./schema";
import { sql, eq, notInArray } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config();

const VALID_SEKTOR_KATEGORIAL = ['Pemuda', 'Kaum Perempuan', 'Kaum Bapak', 'Lansia'];

async function migrateSektorData() {
    console.log("Starting Sektor Kategorial Migration...\n");

    try {
        // 1. Find all records with invalid (old) sector values
        const invalidRecords = await db.select({
            id: congregants.id,
            fullName: congregants.fullName,
            sector: congregants.sector,
            gender: congregants.gender,
            dateOfBirth: congregants.dateOfBirth
        })
            .from(congregants)
            .where(notInArray(congregants.sector, VALID_SEKTOR_KATEGORIAL));

        console.log(`Found ${invalidRecords.length} records with old sector values\n`);

        if (invalidRecords.length === 0) {
            console.log("All records already have valid Sektor Kategorial values!");
            process.exit(0);
        }

        // 2. Update each record based on age and gender
        let updated = 0;
        for (const record of invalidRecords) {
            let newSector = 'Pemuda'; // Default

            // Calculate age if birthdate is available
            if (record.dateOfBirth) {
                const birthDate = new Date(record.dateOfBirth);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                // Determine Sektor Kategorial based on age and gender
                if (age >= 60) {
                    newSector = 'Lansia';
                } else if (age >= 35) {
                    newSector = record.gender === 'Perempuan' ? 'Kaum Perempuan' : 'Kaum Bapak';
                } else {
                    newSector = 'Pemuda';
                }
            }

            // Update the record
            await db.update(congregants)
                .set({ sector: newSector })
                .where(eq(congregants.id, record.id));

            console.log(`✓ ${record.fullName}: "${record.sector}" -> "${newSector}"`);
            updated++;
        }

        console.log(`\n✅ Migration complete! Updated ${updated} records.`);
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrateSektorData();
