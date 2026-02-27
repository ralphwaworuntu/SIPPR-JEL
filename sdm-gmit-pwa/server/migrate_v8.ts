import { db } from './db';
import { sql } from 'drizzle-orm';

async function migrate() {
    try {
        console.log("Migrating database (v8) - Adding new fields...");
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN blood_type VARCHAR(10);`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN marital_status VARCHAR(50);`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN marriage_date DATE;`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN marriage_type JSON;`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN baptism_status VARCHAR(50);`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN sidi_status VARCHAR(50);`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN city VARCHAR(100);`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN district VARCHAR(100);`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN subdistrict VARCHAR(100);`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN education_has_scholarship VARCHAR(10);`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN education_scholarship_type VARCHAR(100);`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN education_scholarship_type_other VARCHAR(100);`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN economics_expense_non_pangan_ii INT DEFAULT 0;`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN economics_expense_loan INT DEFAULT 0;`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN economics_expense_unexpected INT DEFAULT 0;`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN economics_expense_worship INT DEFAULT 0;`); } catch (e: any) { console.log(e.message); }
        try { await db.execute(sql`ALTER TABLE congregants ADD COLUMN health_bpjs_non_participants TEXT;`); } catch (e: any) { console.log(e.message); }
        console.log("Migration successful.");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}
migrate();
