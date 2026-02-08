import { notInArray, sql } from "drizzle-orm";
import express from "express";
import cors from "cors";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import rateLimit from "express-rate-limit";
import { auth } from "./auth";
import { db } from "./db";
import { congregants } from "./schema";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors({
    origin: "http://localhost:5173", // Vite frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
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
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        next();
    } catch (error) {
        console.error("Auth Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
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
    education: c.educationLevel || "-",
    educationLevel: c.educationLevel || "-",
    major: c.major || "-",
    job: c.jobCategory || "-",
    jobCategory: c.jobCategory || "-",
    jobTitle: c.jobTitle || "-",
    companyName: c.companyName || "-",
    yearsOfExperience: c.yearsOfExperience || 0,
    skills: typeof c.skills === 'string' ? JSON.parse(c.skills) : (c.skills || []),
    willingnessToServe: c.willingnessToServe || "Not-available",
    interestAreas: typeof c.interestAreas === 'string' ? JSON.parse(c.interestAreas) : (c.interestAreas || []),
    contributionTypes: typeof c.contributionTypes === 'string' ? JSON.parse(c.contributionTypes) : (c.contributionTypes || []),
    initials: (c.fullName || "X").substring(0, 2).toUpperCase(),
    gender: c.gender || "Laki-laki",
    birthDate: c.dateOfBirth ? new Date(c.dateOfBirth).toISOString().split('T')[0] : "",
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
});

import { eq, like, and, desc, sql } from "drizzle-orm";

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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch members" });
    }
});

// 2. POST Member (Admin)
app.post("/api/members", async (req, res) => {
    try {
        const data = req.body;
        await db.insert(congregants).values({
            fullName: data.name,
            gender: data.gender,
            dateOfBirth: data.birthDate ? new Date(data.birthDate) : null,
            phone: data.phone,
            address: data.address,
            sector: data.sector,
            lingkungan: data.lingkungan,
            rayon: data.rayon,
            educationLevel: data.education,
            major: data.major,
            jobCategory: data.jobCategory,
            jobTitle: data.jobTitle,
            companyName: data.companyName,
            yearsOfExperience: data.yearsOfExperience,
            skills: Array.isArray(data.skills) ? JSON.stringify(data.skills) : JSON.stringify([]),
            willingnessToServe: data.willingnessToServe,
            interestAreas: Array.isArray(data.interestAreas) ? JSON.stringify(data.interestAreas) : JSON.stringify([]),
            contributionTypes: Array.isArray(data.contributionTypes) ? JSON.stringify(data.contributionTypes) : JSON.stringify([]),
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
            sector: data.sector,
            lingkungan: data.lingkungan,
            rayon: data.rayon,
            educationLevel: data.educationLevel,
            major: data.major,
            jobCategory: data.jobCategory,
            jobTitle: data.jobTitle,
            companyName: data.companyName,
            yearsOfExperience: data.yearsOfExperience || 0,
            skills: data.skills ? JSON.stringify(data.skills) : JSON.stringify([]),
            willingnessToServe: data.willingnessToServe,
            interestAreas: data.interestAreas ? JSON.stringify(data.interestAreas) : JSON.stringify([]),
            contributionTypes: data.contributionTypes ? JSON.stringify(data.contributionTypes) : JSON.stringify([]),
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
                fullName: data.name,
                gender: data.gender,
                dateOfBirth: data.birthDate ? new Date(data.birthDate) : null,
                phone: data.phone,
                address: data.address,
                sector: data.sector,
                lingkungan: data.lingkungan,
                rayon: data.rayon,
                educationLevel: data.education,
                major: data.major,
                jobCategory: data.jobCategory,
                jobTitle: data.jobTitle,
                companyName: data.companyName,
                yearsOfExperience: data.yearsOfExperience,
                skills: Array.isArray(data.skills) ? JSON.stringify(data.skills) : JSON.stringify([]),
                willingnessToServe: data.willingnessToServe,
                interestAreas: Array.isArray(data.interestAreas) ? JSON.stringify(data.interestAreas) : JSON.stringify([]),
                contributionTypes: Array.isArray(data.contributionTypes) ? JSON.stringify(data.contributionTypes) : JSON.stringify([]),
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
        const [totalRes, genderRes, sectorRes, willingnessRes, educationRes, skillsRes, professionalRes] = await Promise.all([
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
                .where(notInArray(congregants.jobCategory, ['Pelajar / Mahasiswa', 'Mengurus Rumah Tangga', 'Pensiunan', 'Belum Bekerja', '-']))
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

        res.json({
            total,
            sectorDominant: dominant,
            activeSkills,
            growth: 12, // Placeholder for now, requires historical tracking
            professionalCount,
            volunteerCount,
            distributions: {
                sector: sectorCounts,
                gender: genderCounts,
                education: educationCounts,
                willingness: willingnessCounts
            }
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ error: "Failed to fetch stats" });
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
