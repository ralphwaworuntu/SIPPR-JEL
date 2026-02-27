import { db } from './db';
import { sql } from 'drizzle-orm';

async function migrate_v9() {
    try {
        console.log("Migrating database (v9) - Adding missing JSON fields...");
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN family_members_non_sidi_names JSON;`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN family_members_non_baptized_names JSON;`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN professional_family_members JSON;`); } catch (e: any) { console.log(e.message); }
        console.log("Migration v9 successful.");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}
migrate_v9();
