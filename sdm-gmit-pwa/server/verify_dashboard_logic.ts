
import { db } from "./db";
import { congregants } from "./schema";
import { sql, notInArray } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config();

async function testDashboardStats() {
    console.log("Testing Dashboard Stats Logic directly...");

    try {
        const [totalRes, genderRes, sectorRes, willingnessRes, educationRes, skillsRes, professionalRes] = await Promise.all([
            db.select({ count: sql<number>`count(*)` }).from(congregants),
            db.select({ gender: congregants.gender, count: sql<number>`count(*)` }).from(congregants).groupBy(congregants.gender),
            db.select({ sector: congregants.sector, count: sql<number>`count(*)` }).from(congregants).groupBy(congregants.sector),
            db.select({ willingness: congregants.willingnessToServe, count: sql<number>`count(*)` }).from(congregants).groupBy(congregants.willingnessToServe),
            db.select({ education: congregants.educationLevel, count: sql<number>`count(*)` }).from(congregants).groupBy(congregants.educationLevel),
            db.select({ skills: congregants.skills }).from(congregants),
            db.select({ count: sql<number>`count(*)` })
                .from(congregants)
                .where(notInArray(congregants.jobCategory, ['Pelajar / Mahasiswa', 'Mengurus Rumah Tangga', 'Pensiunan', 'Belum Bekerja', '-']))
        ]);

        const total = totalRes[0]?.count || 0;
        const professionalCount = professionalRes[0]?.count || 0;

        // Process Willingness
        let volunteerCount = 0;
        willingnessRes.forEach(w => {
            if (w.willingness && ['Aktif', 'On-demand'].includes(w.willingness)) {
                volunteerCount += w.count;
            }
        });

        // Process Skills
        let activeSkills = 0;
        skillsRes.forEach(row => {
            try {
                const skills = typeof row.skills === 'string' ? JSON.parse(row.skills) : row.skills;
                if (Array.isArray(skills)) {
                    activeSkills += skills.length;
                }
            } catch (e) { }
        });

        console.log("\n--- Dashboard Stats ---");
        console.log("Total Congregants:", total);
        console.log("Professional Count:", professionalCount);
        console.log("Volunteer Count:", volunteerCount);
        console.log("Active Skills Count:", activeSkills);
        console.log("Gender Distribution:", genderRes);
        console.log("Sector Distribution:", sectorRes);

        console.log("\nVERIFIED!");
        process.exit(0);
    } catch (error) {
        console.error("Test Failed:", error);
        process.exit(1);
    }
}

testDashboardStats();
