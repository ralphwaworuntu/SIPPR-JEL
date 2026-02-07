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
    education: c.educationLevel || "-",
    job: c.jobCategory || "-",
    skills: typeof c.skills === 'string' ? JSON.parse(c.skills) : (c.skills || []),
    initials: (c.fullName || "X").substring(0, 2).toUpperCase(),
    gender: c.gender || "Laki-laki",
    birthDate: c.dateOfBirth ? new Date(c.dateOfBirth).toISOString().split('T')[0] : "",
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    statusGerejawi: "Sidi" // Placeholder as schema doesn't have it explicitly yet or mapped differently
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

// 2. POST Member
app.post("/api/members", async (req, res) => {
    try {
        const data = req.body;
        await db.insert(congregants).values({
            fullName: data.name,
            gender: data.gender,
            dateOfBirth: data.birthDate ? new Date(data.birthDate) : null,
            sector: data.sector,
            educationLevel: data.education,
            jobCategory: data.job,
            skills: data.skills,
            status: 'VALIDATED' // Auto validate for admin
        });
        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create member" });
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
                sector: data.sector,
                educationLevel: data.education,
                jobCategory: data.job,
                skills: data.skills,
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
        const [totalRes, genderRes, sectorRes] = await Promise.all([
            db.select({ count: sql<number>`count(*)` }).from(congregants),
            db.select({ gender: congregants.gender, count: sql<number>`count(*)` }).from(congregants).groupBy(congregants.gender),
            db.select({ sector: congregants.sector, count: sql<number>`count(*)` }).from(congregants).groupBy(congregants.sector),
        ]);

        const total = totalRes[0]?.count || 0;

        const genderCounts: Record<string, number> = {};
        genderRes.forEach(g => { if (g.gender) genderCounts[g.gender] = g.count; });

        const sectorCounts: Record<string, number> = {};
        let dominant = "-";
        let maxSec = 0;
        sectorRes.forEach(s => {
            if (s.sector) {
                sectorCounts[s.sector] = s.count;
                if (s.count > maxSec) { maxSec = s.count; dominant = s.sector; }
            }
        });

        res.json({
            total,
            sectorDominant: dominant,
            activeSkills: 0, // Implement skill counting if needed
            growth: 0,
            professionalCount: 0, // Needs education filter query
            volunteerCount: 0,
            distributions: {
                sector: sectorCounts,
                gender: genderCounts,
                education: {},
                willingness: {}
            }
        });
    } catch (error) {
        console.error(error);
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
