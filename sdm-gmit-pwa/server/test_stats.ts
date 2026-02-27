import * as dotenv from 'dotenv';
dotenv.config();
import { db } from './db';
import { congregants } from './schema';
import { sql, eq, notInArray, and } from 'drizzle-orm';

async function testStats() {
    try {
        const baseWhere = undefined; // No filter

        console.log("Testing stats query...");
        await Promise.all([
            db.select({ count: sql<number>`count(*)` }).from(congregants).where(baseWhere),
            db.select({
                totalSouls: sql<number>`SUM(family_members)`,
                totalMale: sql<number>`SUM(family_members_male)`,
                totalFemale: sql<number>`SUM(family_members_female)`,
                totalSidi: sql<number>`SUM(family_members_sidi)`
            }).from(congregants),
            db.select({ gender: congregants.gender, count: sql<number>`count(*)` }).from(congregants).groupBy(congregants.gender),
            db.select({ willingness: congregants.willingnessToServe, count: sql<number>`count(*)` }).from(congregants).groupBy(congregants.willingnessToServe),
            db.select({ education: congregants.educationLevel, count: sql<number>`count(*)` }).from(congregants).groupBy(congregants.educationLevel),
            db.select({ skills: congregants.skills }).from(congregants),
            db.select({ count: sql<number>`count(*)` })
                .from(congregants)
                .where(notInArray(congregants.jobCategory, ['Pelajar / Mahasiswa', 'Mengurus Rumah Tangga', 'Pensiunan', 'Belum Bekerja', '-'])),
            db.select({ lingkungan: congregants.lingkungan, count: sql<number>`count(*)` }).from(congregants).groupBy(congregants.lingkungan),
            db.select({ rayon: congregants.rayon, count: sql<number>`count(*)` }).from(congregants).groupBy(congregants.rayon),
            db.select({
                total: sql<number>`SUM(
                    COALESCE(education_in_school_tk_paud, 0) + 
                    COALESCE(education_in_school_sd, 0) + 
                    COALESCE(education_in_school_smp, 0) + 
                    COALESCE(education_in_school_sma, 0) + 
                    COALESCE(education_in_school_university, 0) +
                    COALESCE(education_dropout_tk_paud, 0) + 
                    COALESCE(education_dropout_sd, 0) + 
                    COALESCE(education_dropout_smp, 0) + 
                    COALESCE(education_dropout_sma, 0) + 
                    COALESCE(education_dropout_university, 0) +
                    COALESCE(education_unemployed_sd, 0) + 
                    COALESCE(education_unemployed_smp, 0) + 
                    COALESCE(education_unemployed_sma, 0) + 
                    COALESCE(education_unemployed_university, 0) +
                    COALESCE(education_working, 0)
                )`
            }).from(congregants).where(baseWhere),
            db.select({ type: congregants.diakoniaType, count: sql<number>`count(*)` }).from(congregants).where(and(baseWhere, eq(congregants.diakoniaRecipient, 'Ya'))).groupBy(congregants.diakoniaType),
            db.select({
                assets: congregants.economicsAssets,
                businessType: congregants.economicsBusinessType,
                businessTurnover: congregants.economicsBusinessTurnover,
                businessIssues: congregants.economicsBusinessIssues,
                businessTraining: congregants.economicsBusinessTraining,
                businessNeeds: congregants.economicsBusinessNeeds,
                waterSource: congregants.economicsWaterSource
            }).from(congregants).where(baseWhere),
            db.select({
                disabilityPhysical: congregants.healthDisabilityPhysical,
                disabilityIntellectual: congregants.healthDisabilityIntellectual,
                disabilityMental: congregants.healthDisabilityMental,
                disabilitySensory: congregants.healthDisabilitySensory,
                chronicDisease: congregants.healthChronicDisease,
                sick30Days: congregants.healthSick30Days,
                regularTreatment: congregants.healthRegularTreatment
            }).from(congregants).where(baseWhere)
        ]);
        console.log("All queries successful!");
    } catch (e: any) {
        console.error("Query failed:", e.message);
    }
    process.exit(0);
}
testStats();
