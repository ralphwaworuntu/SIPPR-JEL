import * as dotenv from 'dotenv';
dotenv.config();
import { db } from './db.ts';
import { congregants } from './schema.ts';
import { sql, eq, notInArray, and } from 'drizzle-orm';

async function testStats() {
    try {
        const baseWhere = undefined;

        console.log("Fetching data from DB...");
        // Paste the exact Promise.all from index.ts
        const [totalRes, soulsRes, genderRes, willingnessRes, educationRes, skillsRes, professionalRes, lingkunganRes, rayonRes, eduSumRes, diakoniaRes, economicsRes, healthRes] = await Promise.all([
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

        console.log("Processing Data...");
        const total = totalRes[0]?.count || 0;
        const soulsData = soulsRes[0] || { totalSouls: 0, totalMale: 0, totalFemale: 0, totalSidi: 0 };
        const totalSouls = Number(soulsData.totalSouls) || total;

        const genderCounts: Record<string, number> = {
            "Laki-laki": Number(soulsData.totalMale) || 0,
            "Perempuan": Number(soulsData.totalFemale) || 0
        };
        if (genderCounts["Laki-laki"] === 0 && genderCounts["Perempuan"] === 0) {
            genderRes.forEach(g => { if (g.gender) genderCounts[g.gender] = g.count; });
        }

        const lingkunganCounts: Record<string, number> = {};
        lingkunganRes.forEach(l => { if (l.lingkungan) lingkunganCounts[l.lingkungan] = l.count; });

        const rayonCounts: Record<string, number> = {};
        rayonRes.forEach(r => { if (r.rayon) rayonCounts[r.rayon] = r.count; });

        const diakoniaCounts: Record<string, number> = {};
        diakoniaRes.forEach(d => { if (d.type) diakoniaCounts[d.type] = d.count; });

        const assetsCount: Record<string, number> = {};
        const businessIssuesCount: Record<string, number> = {};
        const businessTrainingCount: Record<string, number> = {};
        const businessTurnoverCount: Record<string, number> = {};
        const businessNeedsCount: Record<string, number> = {};
        const waterSourceCount: Record<string, number> = {};

        economicsRes.forEach(e => {
            if (e.waterSource) {
                try {
                    const parsed = typeof e.waterSource === 'string' ? JSON.parse(e.waterSource) : e.waterSource;
                    if (Array.isArray(parsed)) {
                        parsed.forEach(w => { waterSourceCount[w] = (waterSourceCount[w] || 0) + 1; });
                    }
                } catch (err) { }
            }
            if (e.assets) {
                try {
                    const parsed = typeof e.assets === 'string' ? JSON.parse(e.assets) : e.assets;
                    if (Array.isArray(parsed)) {
                        parsed.forEach(a => { assetsCount[a] = (assetsCount[a] || 0) + 1; });
                    }
                } catch (err) { }
            }
            if (e.businessType) {
                if (e.businessTurnover) businessTurnoverCount[e.businessTurnover] = (businessTurnoverCount[e.businessTurnover] || 0) + 1;
                if (e.businessIssues) businessIssuesCount[e.businessIssues] = (businessIssuesCount[e.businessIssues] || 0) + 1;
                if (e.businessTraining) businessTrainingCount[e.businessTraining] = (businessTrainingCount[e.businessTraining] || 0) + 1;
                if (e.businessNeeds) businessNeedsCount[e.businessNeeds] = (businessNeedsCount[e.businessNeeds] || 0) + 1;
            }
        });

        const disabilityCount: Record<string, number> = { "Fisik": 0, "Intelektual": 0, "Mental": 0, "Sensorik": 0 };
        const chronicCount: Record<string, number> = {};
        let sick30DaysCount = 0;
        let regularTreatmentCount = 0;

        healthRes.forEach(h => {
            if (h.sick30Days === 'Ya') sick30DaysCount++;
            if (h.regularTreatment === 'Ya') regularTreatmentCount++;
            try {
                if (h.disabilityPhysical) {
                    const p = typeof h.disabilityPhysical === 'string' ? JSON.parse(h.disabilityPhysical) : h.disabilityPhysical;
                    if (Array.isArray(p) && p.length > 0) disabilityCount["Fisik"]++;
                }
                if (h.disabilityIntellectual) {
                    const p = typeof h.disabilityIntellectual === 'string' ? JSON.parse(h.disabilityIntellectual) : h.disabilityIntellectual;
                    if (Array.isArray(p) && p.length > 0) disabilityCount["Intelektual"]++;
                }
                if (h.disabilityMental) {
                    const p = typeof h.disabilityMental === 'string' ? JSON.parse(h.disabilityMental) : h.disabilityMental;
                    if (Array.isArray(p) && p.length > 0) disabilityCount["Mental"]++;
                }
                if (h.disabilitySensory) {
                    const p = typeof h.disabilitySensory === 'string' ? JSON.parse(h.disabilitySensory) : h.disabilitySensory;
                    if (Array.isArray(p) && p.length > 0) disabilityCount["Sensorik"]++;
                }
            } catch (err) { }
            if (h.chronicDisease) {
                try {
                    const parsed = typeof h.chronicDisease === 'string' ? JSON.parse(h.chronicDisease) : h.chronicDisease;
                    if (Array.isArray(parsed)) {
                        parsed.forEach((c: any) => { chronicCount[c] = (chronicCount[c] || 0) + 1; });
                    }
                } catch (err) { }
            }
        });

        const willingnessCounts: Record<string, number> = {};
        let volunteerCount = 0;
        willingnessRes.forEach(w => {
            if (w.willingness) {
                willingnessCounts[w.willingness] = w.count;
                if (['Aktif', 'Active', 'Ya', 'On-demand'].includes(w.willingness)) {
                    volunteerCount += w.count;
                }
            }
        });

        const educationCounts: Record<string, number> = {};
        educationRes.forEach(e => { if (e.education) educationCounts[e.education] = e.count; });

        let activeSkills = 0;
        skillsRes.forEach(row => {
            try {
                const skills = typeof row.skills === 'string' ? JSON.parse(row.skills) : row.skills;
                if (Array.isArray(skills)) {
                    activeSkills += skills.length;
                }
            } catch (e) { }
        });

        const professionalCount = professionalRes[0]?.count || 0;

        const profFamilyRes = await db.select({ pfm: congregants.professionalFamilyMembers }).from(congregants);
        let professionalFamilyCount = 0;
        profFamilyRes.forEach(row => {
            try {
                const pfm = typeof row.pfm === 'string' ? JSON.parse(row.pfm) : row.pfm;
                if (Array.isArray(pfm)) {
                    professionalFamilyCount += pfm.length;
                }
            } catch (e) { }
        });

        const finalData = {
            total,
            totalSouls,
            totalSidi: Number(soulsData.totalSidi) || 0,
            activeSkills,
            growth: 0,
            professionalCount,
            professionalFamilyCount,
            volunteerCount,
            educationCount: Number(eduSumRes[0]?.total) || 0,
            sick30DaysCount,
            regularTreatmentCount,
            distributions: {
                gender: genderCounts,
                education: educationCounts,
                willingness: willingnessCounts,
                lingkungan: lingkunganCounts,
                rayon: rayonCounts,
                diakonia: diakoniaCounts,
                assets: assetsCount,
                businessTurnover: businessTurnoverCount,
                businessIssues: Object.entries(businessIssuesCount).sort((a, b) => b[1] - a[1]).slice(0, 5).reduce((obj, [k, v]) => { obj[k] = v; return obj; }, {} as Record<string, number>),
                businessTraining: Object.entries(businessTrainingCount).sort((a, b) => b[1] - a[1]).slice(0, 5).reduce((obj, [k, v]) => { obj[k] = v; return obj; }, {} as Record<string, number>),
                businessNeeds: Object.entries(businessNeedsCount).sort((a, b) => b[1] - a[1]).slice(0, 5).reduce((obj, [k, v]) => { obj[k] = v; return obj; }, {} as Record<string, number>),
                waterSource: waterSourceCount,
                disabilities: disabilityCount,
                chronics: Object.entries(chronicCount).sort((a, b) => b[1] - a[1]).slice(0, 5).reduce((obj, [k, v]) => { obj[k] = v; return obj; }, {} as Record<string, number>),
            }
        };

        console.log("Success! Extracted structure:");
        console.log(Object.keys(finalData));
    } catch (err: any) {
        console.error("Dashboard Stats Error:", err.message, err.stack);
    }
    process.exit(0);
}

testStats();
