import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import { db } from "./db";
import { congregants } from "./schema";
import { z } from "zod";
import { REFERENCES } from "./references";
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

// Better Auth Handler
app.all("/api/auth/*", toNodeHandler(auth));

// Public Route
app.get("/", (req, res) => {
    res.send("SDM GMIT Server is Running (MySQL)");
});

// Zod Schema
const congregantSchema = z.object({
    fullName: z.string().min(1, "Nama lengkap wajib diisi"),
    gender: z.enum(["Laki-laki", "Perempuan"]),
    dateOfBirth: z.string().or(z.date()), // Handle both string from JSON and Date obj
    phone: z.string().min(1, "Nomor telepon wajib diisi"),
    sector: z.string().refine(val => REFERENCES.sectors.includes(val) || REFERENCES.categories.includes(val), "Sektor tidak valid"),
    lingkungan: z.string().optional(),
    rayon: z.string().optional(),
    address: z.string().min(1, "Alamat wajib diisi"),
    educationLevel: z.string().optional(),
    jobCategory: z.string().optional(),
    skills: z.array(z.string()).optional(),
    willingnessToServe: z.union([z.boolean(), z.string()]).transform(val => {
        if (typeof val === 'boolean') return val;
        return ['Aktif', 'On-demand', 'Bersedia'].includes(val);
    }),
});

// API Routes

// GET References
app.get("/api/references", (req, res) => {
    res.json(REFERENCES);
});

app.post("/api/congregants", async (req, res) => {
    try {
        const data = req.body;

        // Validation with Zod
        const validation = congregantSchema.safeParse(data);

        if (!validation.success) {
            res.status(400).json({
                error: "Validation Error",
                details: validation.error.format()
            });
            return;
        }

        const validData = validation.data;

        const newCongregant = await db.insert(congregants).values({
            fullName: validData.fullName,
            gender: validData.gender,
            dateOfBirth: new Date(validData.dateOfBirth),
            phone: validData.phone,
            sector: validData.sector,
            lingkungan: validData.lingkungan,
            rayon: validData.rayon,
            address: validData.address,
            educationLevel: validData.educationLevel,
            jobCategory: validData.jobCategory,
            skills: validData.skills, // JSON
            willingnessToServe: validData.willingnessToServe,
            status: 'PENDING'
        });

        res.status(201).json({ success: true, message: "Data berhasil disimpan", id: newCongregant[0].insertId });
    } catch (error) {
        console.error("Error saving congregant:", error);
        res.status(500).json({ error: "Failed to save data" });
    }
});

// GET Congregants
app.get("/api/congregants", async (req, res) => {
    try {
        const result = await db.select().from(congregants);
        res.json(result);
    } catch (error) {
        console.error("Error fetching congregants:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
