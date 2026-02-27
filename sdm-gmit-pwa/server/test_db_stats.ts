import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

async function run() {
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    try {
        // Check what columns exist in congregants table
        const [cols] = await conn.query(`SHOW COLUMNS FROM congregants`);
        console.log("=== CONGREGANTS COLUMNS ===");
        (cols as any[]).forEach(c => console.log(`  ${c.Field} (${c.Type})`));
        
        // Try to run the exact same queries as the dashboard stats endpoint
        console.log("\n=== TESTING STATS QUERIES ===");
        
        // 1. Total count
        const [totalRes] = await conn.query(`SELECT count(*) as count FROM congregants`);
        console.log("1. Total:", (totalRes as any[])[0].count);
        
        // 2. Souls
        const [soulsRes] = await conn.query(`SELECT SUM(family_members) as totalSouls, SUM(family_members_male) as totalMale, SUM(family_members_female) as totalFemale, SUM(family_members_sidi) as totalSidi FROM congregants`);
        console.log("2. Souls:", JSON.stringify((soulsRes as any[])[0]));
        
        // 3. Gender
        const [genderRes] = await conn.query(`SELECT gender, count(*) as count FROM congregants GROUP BY gender`);
        console.log("3. Gender:", JSON.stringify(genderRes));
        
        // 4. Willingness
        const [willingnessRes] = await conn.query(`SELECT willingness_to_serve, count(*) as count FROM congregants GROUP BY willingness_to_serve`);
        console.log("4. Willingness:", JSON.stringify(willingnessRes));
        
        // 5. Education
        const [educationRes] = await conn.query(`SELECT education_level, count(*) as count FROM congregants GROUP BY education_level`);
        console.log("5. Education:", JSON.stringify(educationRes));
        
        // 6. Professional with notInArray
        const [profRes] = await conn.query(`SELECT count(*) as count FROM congregants WHERE job_category NOT IN ('Pelajar / Mahasiswa', 'Mengurus Rumah Tangga', 'Pensiunan', 'Belum Bekerja', '-')`);
        console.log("6. Professional:", JSON.stringify((profRes as any[])[0]));
        
        // 7. Diakonia
        const [diakoniaRes] = await conn.query(`SELECT diakonia_type, count(*) as count FROM congregants WHERE diakonia_recipient = 'Ya' GROUP BY diakonia_type`);
        console.log("7. Diakonia:", JSON.stringify(diakoniaRes));

        console.log("\n=== ALL STATS QUERIES PASSED ===");
    } catch (err: any) {
        console.error("ERROR:", err.code, err.sqlMessage);
        console.error("SQL:", err.sql);
    }
    await conn.end();
}

run();
