import { eq, notInArray, sql } from "drizzle-orm";
import express from "express";
import cors from "cors";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import rateLimit from "express-rate-limit";
import { auth } from "./auth";
import { db } from "./db";
import { congregants, notifications } from "./schema";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors({
    origin: (origin, callback) => {
        // Allow all local network origins and localhost
        if (!origin || origin.startsWith("http://localhost") || origin.match(/^http:\/\/192\.168\./)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." }
});
app.use("/api", limiter);

// Middleware: Authenticated only
const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (!session) {
            console.log("Auth failed: No session found for request to", req.path);
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        next();
    } catch (error: any) {
        console.error("Auth Middleware Error:", error);
        res.status(500).json({ error: "Internal Server Error during auth", details: error.message });
    }
};

// Better Auth Handler
app.all("/api/auth/*", toNodeHandler(auth));

// Protect API Routes
app.use("/api/members", requireAuth);
app.use("/api/dashboard", requireAuth);

// Public Route
app.get("/", (req, res) => {
    res.send("SDM GMIT Server is Running (MySQL)");
});

// API Routes

// Helper for safe JSON parsing
const safeParse = (val: any, fallback: any = {}) => {
    if (!val) return fallback;
    if (typeof val !== 'string') return val;
    try {
        return JSON.parse(val);
    } catch (e) {
        console.warn("JSON Parse Error for value:", val);
        return fallback;
    }
};

// Helper to map DB congregant to Frontend Member
const mapCongregantToMember = (c: any) => ({
    id: c.id.toString(),
    name: c.fullName,
    sector: c.sector || "-",
    lingkungan: c.lingkungan || "-",
    rayon: c.rayon || "-",
    address: c.address || "-",
    latitude: c.latitude || null,
    longitude: c.longitude || null,
    phone: c.phone || "-",
    kkNumber: c.kkNumber || "-",
    nik: c.nik || "-",
    gender: c.gender || "Laki-laki",
    birthDate: c.dateOfBirth ? new Date(c.dateOfBirth).toISOString().split('T')[0] : "",

    // Family Profile
    familyMembersMale: c.familyMembersMale || 0,
    familyMembersFemale: c.familyMembersFemale || 0,
    familyMembersOutside: c.familyMembersOutside || 0,
    familyMembersSidi: c.familyMembersSidi || 0,
    familyMembersSidiMale: c.familyMembersSidiMale || 0,
    familyMembersSidiFemale: c.familyMembersSidiFemale || 0,
    familyMembersNonBaptized: c.familyMembersNonBaptized || 0,
    familyMembersNonSidi: c.familyMembersNonSidi || 0,

    // Diakonia
    diakonia_recipient: c.diakoniaRecipient || "Tidak",
    diakonia_year: c.diakoniaYear || "",
    diakonia_type: c.diakoniaType || "",

    // Professional
    education: c.educationLevel || "-",
    educationLevel: c.educationLevel || "-",
    major: c.major || "-",
    job: c.jobCategory || "-",
    jobCategory: c.jobCategory || "-",
    jobTitle: c.jobTitle || "-",
    companyName: c.companyName || "-",
    yearsOfExperience: c.yearsOfExperience || 0,
    skills: safeParse(c.skills, []),

    // Education Detail
    education_schoolingStatus: c.educationSchoolingStatus || "Tidak ada anak usia sekolah",
    education_in_school: safeParse(c.educationInSchool),
    education_dropout: safeParse(c.educationDropout),
    education_unemployed: safeParse(c.educationUnemployed),
    education_working: c.educationWorking || 0,

    // Economics
    economics_headOccupation: c.economicsHeadOccupation || "",
    economics_spouseOccupation: c.economicsSpouseOccupation || "",
    economics_incomeRange: c.economicsIncomeRange || "",
    economics_incomeRangeDetailed: c.economicsIncomeRangeDetailed || "",
    economics_expense: safeParse(c.economicsExpense),

    // Business
    economics_hasBusiness: c.economicsHasBusiness || "Tidak",
    economics_business_data: safeParse(c.economicsBusinessData),

    // Asset & Home
    economics_houseStatus: c.economicsHouseStatus || "",
    economics_houseType: c.economicsHouseType || "",
    economics_houseIMB: c.economicsHouseIMB || "",
    economics_assets: safeParse(c.economicsAssets),
    economics_landStatus: c.economicsLandStatus || "",
    economics_waterSource: c.economicsWaterSource || "",
    economics_electricity: safeParse(c.economicsElectricityDetail),

    // Health
    health_sick30Days: c.healthSick30Days || "Tidak",
    health_chronicSick: c.healthChronicSick || "Tidak",
    health_chronic_disease: safeParse(c.healthChronicDisease),
    health_hasBPJS: c.healthHasBPJS || "Tidak",
    health_regularTreatment: c.healthRegularTreatment || "Tidak",
    health_hasBPJSKetenagakerjaan: c.healthHasBPJSKetenagakerjaan || "Tidak",
    health_socialAssistance: c.healthSocialAssistance || "Tidak",
    health_disability_detail: safeParse(c.healthDisabilityDetail),

    // Commitment
    willingnessToServe: c.willingnessToServe || "Not-available",
    interestAreas: safeParse(c.interestAreas, []),
    contributionTypes: safeParse(c.contributionTypes, []),
    professionalFamilyMembers: safeParse(c.professionalFamilyMembers, []),

    initials: (c.fullName || "X").substring(0, 2).toUpperCase(),
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
});

import { eq, like, and, desc } from "drizzle-orm";

// 1. GET Members (with Search & Filter)
app.get("/api/members", async (req, res) => {
    try {
        const { search, sector, gender, education } = req.query;

        const filters = [];
        if (search) filters.push(like(congregants.fullName, `%${search}%`));
        if (sector && sector !== "Semua") filters.push(eq(congregants.sector, String(sector)));
        if (gender && gender !== "Semua") filters.push(eq(congregants.gender, String(gender)));

        const result = await db.select()
            .from(congregants)
            .where(and(...filters))
            .orderBy(desc(congregants.createdAt));

        res.json(result.map(mapCongregantToMember));
    } catch (error: any) {
        console.error("Fetch Members Error:", error);
        res.status(500).json({ error: "Failed to fetch members", details: error.message });
    }
});

// 2. POST Member (Admin)
app.post("/api/members", async (req, res) => {
    try {
        const data = req.body;
        await db.insert(congregants).values({
            fullName: data.name || data.fullName,
            gender: data.gender,
            dateOfBirth: data.birthDate ? new Date(data.birthDate) : null,
            phone: data.phone,
            address: data.address,
            kkNumber: data.kkNumber,
            nik: data.nik,
            sector: data.sector,
            lingkungan: data.lingkungan,
            rayon: data.rayon,

            // Family Profile
            familyMembersMale: Number(data.familyMembersMale) || 0,
            familyMembersFemale: Number(data.familyMembersFemale) || 0,
            familyMembersOutside: Number(data.familyMembersOutside) || 0,
            familyMembersSidi: Number(data.familyMembersSidi) || 0,
            familyMembersSidiMale: Number(data.familyMembersSidiMale) || 0,
            familyMembersSidiFemale: Number(data.familyMembersSidiFemale) || 0,
            familyMembersNonBaptized: Number(data.familyMembersNonBaptized) || 0,
            familyMembersNonSidi: Number(data.familyMembersNonSidi) || 0,

            // Diakonia
            diakoniaRecipient: data.diakonia_recipient,
            diakoniaYear: data.diakonia_year,
            diakoniaType: data.diakonia_type,

            educationLevel: data.educationLevel,
            major: data.major,
            jobCategory: data.jobCategory,
            jobTitle: data.jobTitle,
            companyName: data.companyName,
            yearsOfExperience: Number(data.yearsOfExperience) || 0,

            // Education Detail
            educationSchoolingStatus: data.education_schoolingStatus,
            educationInSchool: JSON.stringify(data.education_in_school || {}),
            educationDropout: JSON.stringify(data.education_dropout || {}),
            educationUnemployed: JSON.stringify(data.education_unemployed || {}),
            educationWorking: Number(data.education_working) || 0,

            // Economics
            economicsHeadOccupation: data.economics_headOccupation,
            economicsSpouseOccupation: data.economics_spouseOccupation,
            economicsIncomeRange: data.economics_incomeRange,
            economicsIncomeRangeDetailed: data.economics_incomeRangeDetailed,
            economicsExpense: JSON.stringify(data.economics_expense || {}),

            // Business
            economicsHasBusiness: data.economics_hasBusiness,
            economicsBusinessData: JSON.stringify(data.economics_business_data || {}),

            // Asset & Home
            economicsHouseStatus: data.economics_houseStatus,
            economicsHouseType: data.economics_houseType,
            economicsHouseIMB: data.economics_houseIMB,
            economicsAssets: JSON.stringify(data.economics_assets || {}),
            economicsLandStatus: data.economics_landStatus,
            economicsWaterSource: data.economics_waterSource,
            economicsElectricityDetail: JSON.stringify(data.economics_electricity || {}),

            // Health
            healthSick30Days: data.health_sick30Days,
            healthChronicSick: data.health_chronicSick,
            healthChronicDisease: JSON.stringify(data.health_chronic_disease || {}),
            healthHasBPJS: data.health_hasBPJS,
            healthRegularTreatment: data.health_regularTreatment,
            healthHasBPJSKetenagakerjaan: data.health_hasBPJSKetenagakerjaan,
            healthSocialAssistance: data.health_socialAssistance,
            healthDisabilityDetail: JSON.stringify(data.health_disability_detail || {}),

            skills: Array.isArray(data.skills) ? JSON.stringify(data.skills) : JSON.stringify([]),
            willingnessToServe: data.willingnessToServe,
            interestAreas: Array.isArray(data.interestAreas) ? JSON.stringify(data.interestAreas) : JSON.stringify([]),
            contributionTypes: Array.isArray(data.contributionTypes) ? JSON.stringify(data.contributionTypes) : JSON.stringify([]),
            professionalFamilyMembers: Array.isArray(data.professionalFamilyMembers) ? JSON.stringify(data.professionalFamilyMembers) : JSON.stringify([]),

            latitude: data.latitude?.toString(),
            longitude: data.longitude?.toString(),
            status: 'VALIDATED' // Auto validate for admin
        });
        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create member" });
    }
});

// 2b. Public Registration Route (No Auth)
app.post("/api/congregants", async (req, res) => {
    try {
        const data = req.body;
        console.log("New Registration Attempt:", data.fullName);

        await db.insert(congregants).values({
            fullName: data.fullName,
            gender: data.gender,
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
            phone: data.phone,
            address: data.address,
            kkNumber: data.kkNumber,
            nik: data.nik,
            sector: data.sector,
            lingkungan: data.lingkungan,
            rayon: data.rayon,

            // Family Profile
            familyMembersMale: Number(data.familyMembersMale) || 0,
            familyMembersFemale: Number(data.familyMembersFemale) || 0,
            familyMembersOutside: Number(data.familyMembersOutside) || 0,
            familyMembersSidi: Number(data.familyMembersSidi) || 0,
            familyMembersSidiMale: Number(data.familyMembersSidiMale) || 0,
            familyMembersSidiFemale: Number(data.familyMembersSidiFemale) || 0,
            familyMembersNonBaptized: Number(data.familyMembersNonBaptized) || 0,
            familyMembersNonSidi: Number(data.familyMembersNonSidi) || 0,

            // Diakonia
            diakoniaRecipient: data.diakonia_recipient,
            diakoniaYear: data.diakonia_year,
            diakoniaType: data.diakonia_type,

            educationLevel: data.educationLevel,
            major: data.major,
            jobCategory: data.jobCategory,
            jobTitle: data.jobTitle,
            companyName: data.companyName,
            yearsOfExperience: Number(data.yearsOfExperience) || 0,

            // Education Detail
            educationSchoolingStatus: data.education_schoolingStatus,
            educationInSchool: JSON.stringify(data.education_inSchool || {}),
            educationDropout: JSON.stringify(data.education_dropout || {}),
            educationUnemployed: JSON.stringify(data.education_unemployed || {}),
            educationWorking: Number(data.education_working) || 0,

            // Economics
            economicsHeadOccupation: data.economics_headOccupation,
            economicsSpouseOccupation: data.economics_spouseOccupation,
            economicsIncomeRange: data.economics_incomeRange,
            economicsIncomeRangeDetailed: data.economics_incomeRangeDetailed,
            economicsExpense: JSON.stringify(data.economics_expense || {}),

            // Business
            economicsHasBusiness: data.economics_hasBusiness,
            economicsBusinessData: JSON.stringify(data.economics_business_data || {}),

            // Asset & Home
            economicsHouseStatus: data.economics_houseStatus,
            economicsHouseType: data.economics_houseType,
            economicsHouseIMB: data.economics_houseIMB,
            economicsAssets: JSON.stringify(data.economics_assets || {}),
            economicsLandStatus: data.economics_landStatus,
            economicsWaterSource: data.economics_waterSource,
            economicsElectricityDetail: JSON.stringify(data.economics_electricity || {}),

            // Health
            healthSick30Days: data.health_sick30Days,
            healthChronicSick: data.health_chronicSick,
            healthChronicDisease: JSON.stringify(data.health_chronic_disease || {}),
            healthHasBPJS: data.health_hasBPJS,
            healthRegularTreatment: data.health_regularTreatment,
            healthHasBPJSKetenagakerjaan: data.health_hasBPJSKetenagakerjaan,
            healthSocialAssistance: data.health_socialAssistance,
            healthDisabilityDetail: JSON.stringify(data.health_disability_detail || {}),

            skills: data.skills ? JSON.stringify(data.skills) : JSON.stringify([]),
            willingnessToServe: data.willingnessToServe,
            interestAreas: data.interestAreas ? JSON.stringify(data.interestAreas) : JSON.stringify([]),
            contributionTypes: data.contributionTypes ? JSON.stringify(data.contributionTypes) : JSON.stringify([]),
            professionalFamilyMembers: data.professionalFamilyMembers ? JSON.stringify(data.professionalFamilyMembers) : JSON.stringify([]),

            latitude: data.latitude?.toString(),
            longitude: data.longitude?.toString(),
            status: 'PENDING'
        });

        console.log("Registration Successful:", data.fullName);
        res.status(201).json({ success: true, message: "Pendaftaran berhasil" });
    } catch (error) {
        console.error("Submission Error:", error);
        console.error("Error saving congregant:", error);
        res.status(500).json({ error: "Gagal menyimpan data pendaftaran. Pastikan data lengkap." });
    }
});

// 3. PUT Member
app.put("/api/members/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        await db.update(congregants)
            .set({
                fullName: data.name || data.fullName,
                gender: data.gender,
                dateOfBirth: data.birthDate ? new Date(data.birthDate) : null,
                phone: data.phone,
                address: data.address,
                kkNumber: data.kkNumber,
                nik: data.nik,
                sector: data.sector,
                lingkungan: data.lingkungan,
                rayon: data.rayon,

                // Family Profile
                familyMembersMale: Number(data.familyMembersMale) || 0,
                familyMembersFemale: Number(data.familyMembersFemale) || 0,
                familyMembersOutside: Number(data.familyMembersOutside) || 0,
                familyMembersSidi: Number(data.familyMembersSidi) || 0,
                familyMembersSidiMale: Number(data.familyMembersSidiMale) || 0,
                familyMembersSidiFemale: Number(data.familyMembersSidiFemale) || 0,
                familyMembersNonBaptized: Number(data.familyMembersNonBaptized) || 0,
                familyMembersNonSidi: Number(data.familyMembersNonSidi) || 0,

                // Diakonia
                diakoniaRecipient: data.diakonia_recipient,
                diakoniaYear: data.diakonia_year,
                diakoniaType: data.diakonia_type,

                educationLevel: data.educationLevel,
                major: data.major,
                jobCategory: data.jobCategory,
                jobTitle: data.jobTitle,
                companyName: data.companyName,
                yearsOfExperience: Number(data.yearsOfExperience) || 0,

                // Education Detail
                educationSchoolingStatus: data.education_schoolingStatus,
                educationInSchool: JSON.stringify(data.education_in_school || {}),
                educationDropout: JSON.stringify(data.education_dropout || {}),
                educationUnemployed: JSON.stringify(data.education_unemployed || {}),
                educationWorking: Number(data.education_working) || 0,

                // Economics
                economicsHeadOccupation: data.economics_headOccupation,
                economicsSpouseOccupation: data.economics_spouseOccupation,
                economicsIncomeRange: data.economics_incomeRange,
                economicsIncomeRangeDetailed: data.economics_incomeRangeDetailed,
                economicsExpense: JSON.stringify(data.economics_expense || {}),

                // Business
                economicsHasBusiness: data.economics_hasBusiness,
                economicsBusinessData: JSON.stringify(data.economics_business_data || {}),

                // Asset & Home
                economicsHouseStatus: data.economics_houseStatus,
                economicsHouseType: data.economics_houseType,
                economicsHouseIMB: data.economics_houseIMB,
                economicsAssets: JSON.stringify(data.economics_assets || {}),
                economicsLandStatus: data.economics_landStatus,
                economicsWaterSource: data.economics_waterSource,
                economicsElectricityDetail: JSON.stringify(data.economics_electricity || {}),

                // Health
                healthSick30Days: data.health_sick30Days,
                healthChronicSick: data.health_chronicSick,
                healthChronicDisease: JSON.stringify(data.health_chronic_disease || {}),
                healthHasBPJS: data.health_hasBPJS,
                healthRegularTreatment: data.health_regularTreatment,
                healthHasBPJSKetenagakerjaan: data.health_hasBPJSKetenagakerjaan,
                healthSocialAssistance: data.health_socialAssistance,
                healthDisabilityDetail: JSON.stringify(data.health_disability_detail || {}),

                skills: Array.isArray(data.skills) ? JSON.stringify(data.skills) : JSON.stringify([]),
                willingnessToServe: data.willingnessToServe,
                interestAreas: Array.isArray(data.interestAreas) ? JSON.stringify(data.interestAreas) : JSON.stringify([]),
                contributionTypes: Array.isArray(data.contributionTypes) ? JSON.stringify(data.contributionTypes) : JSON.stringify([]),
                professionalFamilyMembers: Array.isArray(data.professionalFamilyMembers) ? JSON.stringify(data.professionalFamilyMembers) : JSON.stringify([]),

                latitude: data.latitude?.toString(),
                longitude: data.longitude?.toString(),
            })
            .where(eq(congregants.id, Number(id)));

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update member" });
    }
});

// 4. DELETE Member
app.delete("/api/members/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.delete(congregants).where(eq(congregants.id, Number(id)));
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete member" });
    }
});

// 5. Dashboard Stats (Aggregated)
app.get("/api/dashboard/stats", async (req, res) => {
    try {
        // Parallel queries for performance
        const [
            totalRes, genderRes, sectorRes, willingnessRes,
            educationRes, skillsRes, professionalRes,
            diakoniaRes, businessRes, disabilityRes
        ] = await Promise.all([
            // 1. Total Count
            db.select({ count: sql<number>`count(*)` }).from(congregants),

            // 2. Gender Distribution
            db.select({ gender: congregants.gender, count: sql<number>`count(*)` }).from(congregants).groupBy(congregants.gender),

            // 3. Sector Distribution
            db.select({ sector: congregants.sector, count: sql<number>`count(*)` }).from(congregants).groupBy(congregants.sector),

            // 4. Willingness Distribution
            db.select({ willingness: congregants.willingnessToServe, count: sql<number>`count(*)` }).from(congregants).groupBy(congregants.willingnessToServe),

            // 5. Education Distribution
            db.select({ education: congregants.educationLevel, count: sql<number>`count(*)` }).from(congregants).groupBy(congregants.educationLevel),

            // 6. Skills (Get all skills to parse and sum)
            db.select({ skills: congregants.skills }).from(congregants),

            // 7. Professional Count (Filter out non-working categories)
            db.select({ count: sql<number>`count(*)` })
                .from(congregants)
                .where(notInArray(congregants.jobCategory, ['Pelajar / Mahasiswa', 'Mengurus Rumah Tangga', 'Pensiunan', 'Belum Bekerja', '-'])),

            // 8. Diakonia Recipients
            db.select({ count: sql<number>`count(*)` }).from(congregants).where(eq(congregants.diakoniaRecipient, 'Ya')),

            // 9. Business Owners
            db.select({ count: sql<number>`count(*)` }).from(congregants).where(eq(congregants.economicsHasBusiness, 'Ya')),

            // 10. Disability Count (using string match in JSON)
            db.select({ count: sql<number>`count(*)` }).from(congregants).where(sql`JSON_UNQUOTE(JSON_EXTRACT(health_disability_detail, '$.hasDisability')) = 'Ya'`)
        ]);

        const total = totalRes[0]?.count || 0;

        // Process Gender
        const genderCounts: Record<string, number> = {};
        genderRes.forEach(g => { if (g.gender) genderCounts[g.gender] = g.count; });

        // Process Sector
        const sectorCounts: Record<string, number> = {};
        let dominant = "-";
        let maxSec = 0;
        sectorRes.forEach(s => {
            if (s.sector) {
                sectorCounts[s.sector] = s.count;
                if (s.count > maxSec) { maxSec = s.count; dominant = s.sector; }
            }
        });

        // Process Willingness
        const willingnessCounts: Record<string, number> = {};
        let volunteerCount = 0;
        willingnessRes.forEach(w => {
            if (w.willingness) {
                willingnessCounts[w.willingness] = w.count;
                if (['Aktif', 'On-demand'].includes(w.willingness)) {
                    volunteerCount += w.count;
                }
            }
        });

        // Process Education
        const educationCounts: Record<string, number> = {};
        educationRes.forEach(e => { if (e.education) educationCounts[e.education] = e.count; });

        // Process Skills
        let activeSkills = 0;
        skillsRes.forEach(row => {
            try {
                const skills = typeof row.skills === 'string' ? JSON.parse(row.skills) : row.skills;
                if (Array.isArray(skills)) {
                    activeSkills += skills.length;
                }
            } catch (e) {
                // Ignore parsing errors
            }
        });

        const professionalCount = professionalRes[0]?.count || 0;
        const diakoniaRecipientCount = diakoniaRes[0]?.count || 0;
        const businessOwnerCount = businessRes[0]?.count || 0;
        const disabilityCount = disabilityRes[0]?.count || 0;

        res.json({
            total,
            sectorDominant: dominant,
            activeSkills,
            growth: 12, // Placeholder for now, requires historical tracking
            professionalCount,
            volunteerCount,
            diakoniaRecipientCount,
            businessOwnerCount,
            disabilityCount,
            distributions: {
                sector: sectorCounts,
                gender: genderCounts,
                education: educationCounts,
                willingness: willingnessCounts
            }
        });
    } catch (error: any) {
        console.error("Dashboard Stats Error:", error);
        // Log more details if it's a DB error
        if (error.sql) {
            console.error("SQL Error Message:", error.message);
            console.error("SQL Code:", error.code);
            console.error("SQL State:", error.sqlState);
        }
        res.status(500).json({ error: "Failed to fetch stats", details: error.message });
    }
});

import multer from "multer";
import fs from "fs";
import csv from "csv-parser";

const upload = multer({ dest: "uploads/" });

// 6. Bulk Import CSV
app.post("/api/members/import", upload.single('file'), async (req, res) => {
    const file = (req as any).file;
    if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
    }

    const results: any[] = [];
    fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (data: any) => results.push(data))
        .on('end', async () => {
            try {
                // Bulk insert
                const insertData = results.map(row => ({
                    fullName: row.Nama || row.Name || "Tanpa Nama",
                    sector: row.Sektor || "Efata",
                    educationLevel: row.Pendidikan || "SMA",
                    jobCategory: row.Pekerjaan || "Belum Bekerja",
                    gender: row.Gender || "Laki-laki",
                    dateOfBirth: row.Umur ? new Date(new Date().getFullYear() - parseInt(row.Umur), 0, 1) : null,
                    skills: row.Keahlian ? JSON.stringify(row.Keahlian.split(';')) : JSON.stringify([]),
                    status: 'VALIDATED'
                }));

                if (insertData.length > 0) {
                    await db.insert(congregants).values(insertData);
                }

                fs.unlinkSync(file.path);

                res.json({ success: true, count: insertData.length });
            } catch (error) {
                console.error("Import error:", error);
                res.status(500).json({ error: "Failed to import data" });
            }
        });
});

// 9. Get Notifications
app.get("/api/notifications", async (req, res) => {
    try {
        let allNotifications = await db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(10);

        // Seed if empty
        if (allNotifications.length === 0) {
            await db.insert(notifications).values([
                { title: "Selamat Datang Admin", message: "Sistem Manajemen Jemaat siap digunakan.", type: "success", isRead: false },
                { title: "Update Data Diperlukan", message: "Mohon lengkapi data profil jemaat baru.", type: "info", isRead: false },
                { title: "Backup Data", message: "Jangan lupa melakukan backup data mingguan.", type: "warning", isRead: false }
            ]);
            allNotifications = await db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(10);
        }

        res.json(allNotifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
});

// 10. Mark Notification as Read
app.put("/api/notifications/:id/read", async (req, res) => {
    try {
        const { id } = req.params;
        await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, parseInt(id)));
        res.json({ success: true });
    } catch (error) {
        console.error("Error updating notification:", error);
        res.status(500).json({ error: "Failed to update notification" });
    }
});

// 11. Mark All Notifications as Read
app.post("/api/notifications/mark-all-read", async (req, res) => {
    try {
        await db.update(notifications).set({ isRead: true });
        res.json({ success: true });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        res.status(500).json({ error: "Failed to mark all as read" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
