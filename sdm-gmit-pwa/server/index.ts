import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
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

app.get("/", (req, res) => {
    res.send("SDM GMIT Server is Running");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
