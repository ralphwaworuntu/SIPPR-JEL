import { db } from './db';
import { sql } from 'drizzle-orm';

async function migrate_v10() {
    try {
        console.log("Migrating database (v10) - Adding missing economics fields...");
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN economics_head_income_range VARCHAR(50);`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN economics_head_income_range_detailed VARCHAR(50);`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN economics_spouse_income_range VARCHAR(50);`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN economics_spouse_income_range_detailed VARCHAR(50);`); } catch (e: any) { console.log(e.message); }
        console.log("Migration v10 successful.");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}
migrate_v10();
