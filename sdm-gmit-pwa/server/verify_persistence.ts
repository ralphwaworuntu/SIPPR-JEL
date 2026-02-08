
import axios from "axios";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const API_URL = "http://localhost:3000/api/congregants";
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sdm_gmit'
};

const testData = {
    fullName: "Vero Test " + Date.now(),
    gender: "Perempuan",
    dateOfBirth: "1995-05-15",
    phone: "081234567890",
    address: "Jl. Test No. 10",
    sector: "Pemuda",
    lingkungan: "3",
    rayon: "5",
    educationLevel: "S1",
    major: "Quality Assurance",
    jobCategory: "Tenaga Profesional",
    jobTitle: "Lead Tester",
    companyName: "Test Factory",
    yearsOfExperience: 5,
    skills: ["Testing", "Debugging"],
    willingnessToServe: "Aktif",
    interestAreas: ["Teknologi", "Pendidikan"],
    contributionTypes: ["Tenaga Ahli", "Relawan"],
    latitude: -10.1772,
    longitude: 123.6070
};

async function verifyPersistence() {
    try {
        console.log("Submitting test registration...");
        const response = await axios.post(API_URL, testData);
        console.log("Response:", response.data);

        if (response.data.success) {
            console.log("Waiting for DB to settle...");
            await new Promise(r => setTimeout(r, 1000));

            console.log("Checking database...");
            const connection = await mysql.createConnection(dbConfig);
            const [rows]: any = await connection.query(
                "SELECT * FROM congregants WHERE full_name = ?",
                [testData.fullName]
            );

            if (rows.length > 0) {
                const member = rows[0];
                console.log("\n--- Audit Results ---");
                console.log("Name Match:", member.full_name === testData.fullName);
                console.log("Sektor Match:", member.sector === testData.sector);
                console.log("Major Match:", member.major === testData.major);
                console.log("Job Title Match:", member.job_title === testData.jobTitle);
                console.log("Willingness Match:", member.willingness_to_serve === testData.willingnessToServe);

                const interests = JSON.parse(member.interest_areas);
                console.log("Interests Logic Match:", Array.isArray(interests) && interests.includes("Teknologi"));

                const contributions = JSON.parse(member.contribution_types);
                console.log("Contributions Logic Match:", Array.isArray(contributions) && contributions.includes("Relawan"));

                console.log("Latitude Match:", member.latitude === testData.latitude.toString());
                console.log("Longitude Match:", member.longitude === testData.longitude.toString());

                console.log("\nFULL PERSISTENCE VERIFIED!");
            } else {
                console.error("Member not found in database!");
            }
            await connection.end();
        }
    } catch (error: any) {
        console.error("Test failed:", error.response?.data || error.message);
    }
}

verifyPersistence();
