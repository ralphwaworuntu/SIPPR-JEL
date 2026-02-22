import { db } from "./db";
import { sql, notInArray } from "drizzle-orm";
import { congregants } from "./schema";

async function testStats() {
    try {
        console.log("Testing queries...");
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
        console.log("Success!");
        console.log("total", totalRes);
    } catch (e) {
        console.error("Error computing stats:", e);
    }
}
testStats().then(() => process.exit(0));
