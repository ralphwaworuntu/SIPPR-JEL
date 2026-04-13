import { db } from './db';
import { congregants } from './schema';
import { eq, and, sql, notInArray } from 'drizzle-orm';

async function main() {
    const baseWhere = undefined;

    try {
        console.log('Testing and(baseWhere, ...) logic');
        const q1 = db.select({ type: congregants.diakonia_type, count: sql<number>`count(*)` })
            .from(congregants)
            .where(and(baseWhere, eq(congregants.diakonia_recipient, 'Ya')))
            .groupBy(congregants.diakonia_type);

        await q1;
        console.log('q1 ok');

        const q2 = db.select({ count: sql<number>`count(*)` })
            .from(congregants)
            .where(and(baseWhere, notInArray(congregants.jobCategory, ['Pelajar / Mahasiswa'])));
        await q2;
        console.log('q2 ok');
    } catch (e: any) {
        console.error('Error:', e.message);
        console.error(e.stack);
    }
}
main().catch(console.error);
