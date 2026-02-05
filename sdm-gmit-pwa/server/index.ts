import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
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

// Better Auth Handler
app.all("/api/auth/*", toNodeHandler(auth));

// Public Route
app.get("/", (req, res) => {
    res.send("SDM GMIT Server is Running (MySQL)");
});

// API Routes
app.post("/api/congregants", async (req, res) => {
    try {
        const data = req.body;

        // Basic validation (can use Zod later)
        if (!data.fullName || !data.sector) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }

        // Map frontend data to schema
        // Frontend sends camelCase, schema handles mapping if defined, but here we defined schema with camelCase keys mostly or snake_case in DB
        // Drizzle defaults: we defined `fullName` as `varchar("full_name")` so we pass `fullName` to insert.

        const newCongregant = await db.insert(congregants).values({
            fullName: data.fullName,
            gender: data.gender,
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
            phone: data.phone,
            sector: data.sector,
            lingkungan: data.lingkungan,
            rayon: data.rayon,
            address: data.address,
            educationLevel: data.educationLevel,
            jobCategory: data.jobCategory,
            skills: data.skills, // JSON
            willingnessToServe: ['Aktif', 'On-demand', 'Bersedia', true].includes(data.willingnessToServe),
            status: 'PENDING'
        });

        res.status(201).json({ success: true, message: "Data berhasil disimpan", id: newCongregant[0].insertId });
    } catch (error) {
        console.error("Error saving congregant:", error);
        res.status(500).json({ error: "Failed to save data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
