import { eq, like, and, desc, count, notInArray, sql } from "drizzle-orm";
import express from "express";
import cors from "cors";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import rateLimit from "express-rate-limit";
import { auth } from "./auth";
import { db } from "./db";
import { congregants, notifications, enumerators, pendamping, user, account, visits } from "./schema";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";
import multer from "multer";
import csv from "csv-parser";

dotenv.config();
// const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

console.log('Backend server starting...');
console.log('Port:', PORT);

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
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        next();
    } catch (error) {
        console.error("Auth Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) });
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

app.get("/api/health", async (req, res) => {
    try {
        await db.execute(sql`SELECT 1`);
        res.json({ status: "ok", database: "connected" });
    } catch (error: any) {
        res.status(500).json({ status: "error", database: "disconnected", error: error.message });
    }
});

// API Routes

const safeParseJSON = (data: any, fallback: any = []) => {
    if (!data) return fallback;
    if (typeof data !== 'string') return data;
    try {
        return JSON.parse(data);
    } catch {
        if (data.trim() !== '') return [data];
        return fallback;
    }
};

const safeISOString = (date: any) => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
};

const safeDateOnlyString = (date: any) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split('T')[0];
};

const safeDateForDB = (date: any) => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split('T')[0];
};

const safeString = (val: any) => {
    if (val === undefined || val === null) return null;
    if (Array.isArray(val)) {
        const joined = val.filter(Boolean).join(', ');
        return joined === '' ? null : joined;
    }
    const str = String(val).trim();
    return str === '' ? null : str;
};

const safeInt = (val: any) => {
    if (val === undefined || val === null || val === '') return null;
    const n = parseInt(val);
    return isNaN(n) ? 0 : n;
};

// Helper to map DB congregant to Frontend Member
const mapCongregantToMember = (c: any) => ({
    id: c.id.toString(),
    name: c.fullName,
    lingkungan: c.lingkungan || "-",
    rayon: c.rayon || "-",
    address: c.address || "-",
    latitude: c.latitude || null,
    longitude: c.longitude || null,
    phone: c.phone || "-",
    educationLevel: c.educationLevel || "-",
    major: c.major || "-",
    jobCategory: c.jobCategory || "-",
    jobTitle: c.jobTitle || "-",
    companyName: c.companyName || "-",
    yearsOfExperience: c.yearsOfExperience || 0,
    skills: safeParseJSON(c.skills),
    willingnessToServe: c.willingnessToServe || "Not-available",
    interestAreas: safeParseJSON(c.interestAreas),
    contributionTypes: safeParseJSON(c.contributionTypes),
    gender: c.gender || "Laki-laki",
    birthDate: safeDateOnlyString(c.dateOfBirth),
    createdAt: safeISOString(c.createdAt) || new Date().toISOString(),
    registrationStatus: c.status || 'PENDING',

    // Step 1: Identity extras
    kkNumber: c.kkNumber || "",
    nik: c.nik || "",
    bloodType: c.bloodType || "",
    maritalStatus: c.maritalStatus || "",
    marriageDate: safeDateOnlyString(c.marriageDate),
    marriageType: safeParseJSON(c.marriageType),
    baptismStatus: c.baptismStatus || "",
    sidiStatus: c.sidiStatus || "",
    city: c.city || "",
    district: c.district || "",
    subdistrict: c.subdistrict || "",
    familyMembers: c.familyMembers || 0,
    familyMembersMale: c.familyMembersMale || 0,
    familyMembersFemale: c.familyMembersFemale || 0,
    familyMembersOutside: c.familyMembersOutside || 0,
    familyMembersSidi: c.familyMembersSidi || 0,
    familyMembersSidiMale: c.familyMembersSidiMale || 0,
    familyMembersSidiFemale: c.familyMembersSidiFemale || 0,
    familyMembersNonBaptized: c.familyMembersNonBaptized || 0,
    familyMembersNonSidi: c.familyMembersNonSidi || 0,
    familyMembersNonSidiNames: safeParseJSON(c.familyMembersNonSidiNames),

    // Step 2: Diakonia
    diakonia_recipient: c.diakoniaRecipient || "",
    diakonia_year: c.diakoniaYear || "",
    diakonia_type: c.diakoniaType || "",

    // Step 3: Professional Family Members
    professionalFamilyMembers: safeParseJSON(c.professionalFamilyMembers),

    // Step 4: Education (Children)
    education_schoolingStatus: c.educationSchoolingStatus || "",
    education_inSchool_tk_paud: c.educationInSchoolTkPaud || 0,
    education_inSchool_sd: c.educationInSchoolSd || 0,
    education_inSchool_smp: c.educationInSchoolSmp || 0,
    education_inSchool_sma: c.educationInSchoolSma || 0,
    education_inSchool_university: c.educationInSchoolUniversity || 0,
    education_dropout_tk_paud: c.educationDropoutTkPaud || 0,
    education_dropout_sd: c.educationDropoutSd || 0,
    education_dropout_smp: c.educationDropoutSmp || 0,
    education_dropout_sma: c.educationDropoutSma || 0,
    education_dropout_university: c.educationDropoutUniversity || 0,
    education_unemployed_sd: c.educationUnemployedSd || 0,
    education_unemployed_smp: c.educationUnemployedSmp || 0,
    education_unemployed_sma: c.educationUnemployedSma || 0,
    education_unemployed_university: c.educationUnemployedUniversity || 0,
    education_working: c.educationWorking || 0,
    education_hasScholarship: c.educationHasScholarship || "",
    education_scholarshipType: c.educationScholarshipType || "",
    education_scholarshipTypeOther: c.educationScholarshipTypeOther || "",

    // Step 5: Economics
    economics_headOccupation: c.economicsHeadOccupation || "",
    economics_headOccupationOther: c.economicsHeadOccupationOther || "",
    economics_headIncomeRange: c.economicsHeadIncomeRange || "",
    economics_headIncomeRangeDetailed: c.economicsHeadIncomeRangeDetailed || "",
    economics_spouseOccupation: c.economicsSpouseOccupation || "",
    economics_spouseOccupationOther: c.economicsSpouseOccupationOther || "",
    economics_spouseIncomeRange: c.economicsSpouseIncomeRange || "",
    economics_spouseIncomeRangeDetailed: c.economicsSpouseIncomeRangeDetailed || "",
    economics_incomeRange: c.economicsIncomeRange || "",
    economics_incomeRangeDetailed: c.economicsIncomeRangeDetailed || "",
    economics_expense_food: c.economicsExpenseFood || 0,
    economics_expense_utilities: c.economicsExpenseUtilities || 0,
    economics_expense_nonPanganII: c.economicsExpenseNonPanganII || 0,
    economics_expense_loan: c.economicsExpenseLoan || 0,
    economics_expense_education: c.economicsExpenseEducation || 0,
    economics_expense_other: c.economicsExpenseOther || 0,
    economics_expense_unexpected: c.economicsExpenseUnexpected || 0,
    economics_expense_worship: c.economicsExpenseWorship || 0,
    economics_hasBusiness: c.economicsHasBusiness || "",
    economics_businessName: c.economicsBusinessName || "",
    economics_businessType: c.economicsBusinessType || "",
    economics_businessTypeOther: c.economicsBusinessTypeOther || "",
    economics_businessDuration: c.economicsBusinessDuration || "",
    economics_businessDurationYears: c.economicsBusinessDurationYears || 0,
    economics_businessStatus: c.economicsBusinessStatus || "",
    economics_businessStatusOther: c.economicsBusinessStatusOther || "",
    economics_businessLocation: c.economicsBusinessLocation || "",
    economics_businessLocationOther: c.economicsBusinessLocationOther || "",
    economics_businessEmployeeCount: c.economicsBusinessEmployeeCount || "",
    economics_businessCapital: c.economicsBusinessCapital || 0,
    economics_businessCapitalSource: c.economicsBusinessCapitalSource || "",
    economics_businessCapitalSourceOther: c.economicsBusinessCapitalSourceOther || "",
    economics_businessPermit: safeParseJSON(c.economicsBusinessPermit),
    economics_businessPermitOther: c.economicsBusinessPermitOther || "",
    economics_businessTurnover: c.economicsBusinessTurnover || "",
    economics_businessTurnoverValue: c.economicsBusinessTurnoverValue || 0,
    economics_businessMarketing: safeParseJSON(c.economicsBusinessMarketing),
    economics_businessMarketingOther: c.economicsBusinessMarketingOther || "",
    economics_businessMarketArea: c.economicsBusinessMarketArea || "",
    economics_businessIssues: c.economicsBusinessIssues || "",
    economics_businessIssuesOther: c.economicsBusinessIssuesOther || "",
    economics_businessNeeds: c.economicsBusinessNeeds || "",
    economics_businessNeedsOther: c.economicsBusinessNeedsOther || "",
    economics_businessSharing: c.economicsBusinessSharing || "",
    economics_businessTraining: c.economicsBusinessTraining || "",
    economics_businessTrainingOther: c.economicsBusinessTrainingOther || "",
    economics_houseStatus: c.economicsHouseStatus || "",
    economics_houseType: c.economicsHouseType || "",
    economics_houseIMB: c.economicsHouseIMB || "",
    economics_hasAssets: c.economicsHasAssets || "",
    economics_totalAssets: c.economicsTotalAssets || 0,
    economics_assets: safeParseJSON(c.economicsAssets),
    economics_asset_motor_qty: c.economicsAssetMotorQty || 0,
    economics_asset_mobil_qty: c.economicsAssetMobilQty || 0,
    economics_asset_kulkas_qty: c.economicsAssetKulkasQty || 0,
    economics_asset_laptop_qty: c.economicsAssetLaptopQty || 0,
    economics_asset_tv_qty: c.economicsAssetTvQty || 0,
    economics_asset_internet_qty: c.economicsAssetInternetQty || 0,
    economics_asset_lahan_qty: c.economicsAssetLahanQty || 0,
    economics_landStatus: c.economicsLandStatus || "",
    economics_waterSource: safeParseJSON(c.economicsWaterSource),
    economics_electricity_capacities: safeParseJSON(c.economicsElectricityCapacities),
    economics_electricity_450_qty: c.economicsElectricity450Qty || 0,
    economics_electricity_900_qty: c.economicsElectricity900Qty || 0,
    economics_electricity_1200_qty: c.economicsElectricity1200Qty || 0,
    economics_electricity_2200_qty: c.economicsElectricity2200Qty || 0,
    economics_electricity_5000_qty: c.economicsElectricity5000Qty || 0,
    economics_electricity_total_cost: c.economicsElectricityTotalCost || 0,

    // Step 6: Health
    health_sick30Days: c.healthSick30Days || "",
    health_chronicSick: c.healthChronicSick || "",
    health_chronicDisease: safeParseJSON(c.healthChronicDisease),
    health_chronicDiseaseOther: c.healthChronicDiseaseOther || "",
    health_hasBPJS: c.healthHasBPJS || "",
    health_bpjsNonParticipants: c.healthBpjsNonParticipants || "",
    health_regularTreatment: c.healthRegularTreatment || "",
    health_hasBPJSKetenagakerjaan: c.healthHasBPJSKetenagakerjaan || "",
    health_socialAssistance: c.healthSocialAssistance || "",
    health_hasDisability: c.healthHasDisability || "",
    health_disabilityPhysical: safeParseJSON(c.healthDisabilityPhysical),
    health_disabilityPhysicalOther: c.healthDisabilityPhysicalOther || "",
    health_disabilityIntellectual: safeParseJSON(c.healthDisabilityIntellectual),
    health_disabilityIntellectualOther: c.healthDisabilityIntellectualOther || "",
    health_disabilityMental: safeParseJSON(c.healthDisabilityMental),
    health_disabilityMentalOther: c.healthDisabilityMentalOther || "",
    health_disabilitySensory: safeParseJSON(c.healthDisabilitySensory),
    health_disabilitySensoryOther: c.healthDisabilitySensoryOther || "",
    health_disabilityDouble: c.healthDisabilityDouble || false,
});

// 1. GET Members (with Search, Filter & optional Pagination)
app.get("/api/members", async (req, res) => {
    try {
        const { search, gender, education, page, limit: limitParam } = req.query;

        const filters = [];
        if (search) filters.push(like(congregants.fullName, `%${search}%`));
        if (gender && gender !== "Semua") filters.push(eq(congregants.gender, String(gender)));

        // If page param is provided, paginate. Otherwise return all.
        if (page) {
            const pageNum = Math.max(1, parseInt(String(page)) || 1);
            const limitNum = Math.min(100, Math.max(1, parseInt(String(limitParam)) || 20));
            const offset = (pageNum - 1) * limitNum;

            const [result, [totalRow]] = await Promise.all([
                db.select().from(congregants)
                    .where(and(...filters))
                    .orderBy(desc(congregants.createdAt))
                    .limit(limitNum)
                    .offset(offset),
                db.select({ total: count() }).from(congregants).where(and(...filters))
            ]);

            res.json({
                data: result.map(mapCongregantToMember),
                pagination: { page: pageNum, limit: limitNum, total: totalRow.total, totalPages: Math.ceil(totalRow.total / limitNum) }
            });
        } else {
            const result = await db.select()
                .from(congregants)
                .where(and(...filters))
                .orderBy(desc(congregants.createdAt));

            res.json(result.map(mapCongregantToMember));
        }
    } catch (error: any) {
        console.error("GET /api/members error:", error);
        res.status(500).json({
            error: "Failed to fetch members",
            details: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        });
    }
});

// GET Professional Family Members Endpoint
app.get("/api/family-members", async (req, res) => {
    try {
        const result = await db.select({
            id: congregants.id,
            name: congregants.fullName,
            lingkungan: congregants.lingkungan,
            professionalFamilyMembers: congregants.professionalFamilyMembers,
            kkNumber: congregants.kkNumber
        })
            .from(congregants)
            .orderBy(desc(congregants.createdAt));

        const familyMembers: any[] = [];

        result.forEach(member => {
            if (member.professionalFamilyMembers) {
                try {
                    const parsed = typeof member.professionalFamilyMembers === 'string'
                        ? JSON.parse(member.professionalFamilyMembers)
                        : member.professionalFamilyMembers;

                    if (Array.isArray(parsed) && parsed.length > 0) {
                        parsed.forEach((pfm: any) => {
                            if (pfm.hasProfessionalSkill === 'Ya') {
                                familyMembers.push({
                                    ...pfm,
                                    mainMemberId: member.id,
                                    mainMemberName: member.name,
                                    mainMemberLingkungan: member.lingkungan,
                                    mainMemberKkNumber: member.kkNumber,
                                });
                            }
                        });
                    }
                } catch (e) {
                    console.error("Error parsing professionalFamilyMembers for member", member.id);
                }
            }
        });

        res.json(familyMembers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch professional family members" });
    }
});

// Helper: Build congregant values from request body (shared by admin & public routes)
const buildCongregantValues = (data: any, isAdmin: boolean = false) => {
    // Note: Drizzle json() columns handle serialization automatically. 
    // Do NOT use JSON.stringify() on them.

    return {
        fullName: data.fullName || data.name,
        gender: data.gender,
        dateOfBirth: safeDateForDB(data.birthDate || data.dateOfBirth),
        phone: data.phone,
        address: data.address,
        lingkungan: data.lingkungan,
        rayon: data.rayon,

        // Step 1: Identity extras
        kkNumber: data.kkNumber || null,
        nik: data.nik || null,
        bloodType: data.bloodType || null,
        maritalStatus: data.maritalStatus || null,
        marriageDate: safeDateForDB(data.marriageDate),
        marriageType: data.marriageType || [],
        baptismStatus: data.baptismStatus || null,
        sidiStatus: data.sidiStatus || null,
        city: data.city || null,
        district: data.district || null,
        subdistrict: data.subdistrict || null,
        familyMembers: safeInt(data.familyMembers),
        familyMembersMale: safeInt(data.familyMembersMale),
        familyMembersFemale: safeInt(data.familyMembersFemale),
        familyMembersOutside: safeInt(data.familyMembersOutside),
        familyMembersSidi: safeInt(data.familyMembersSidi),
        familyMembersSidiMale: safeInt(data.familyMembersSidiMale),
        familyMembersSidiFemale: safeInt(data.familyMembersSidiFemale),
        familyMembersNonBaptized: safeInt(data.familyMembersNonBaptized),
        familyMembersNonSidi: safeInt(data.familyMembersNonSidi),
        familyMembersNonSidiNames: data.familyMembersNonSidiNames || [],
        familyMembersNonBaptizedNames: data.familyMembersNonBaptizedNames || [],

        // Step 2: Diakonia
        diakoniaRecipient: data.diakonia_recipient || null,
        diakoniaYear: data.diakonia_year || null,
        diakoniaType: data.diakonia_type || null,

        // Professional
        educationLevel: data.education || data.educationLevel,
        major: data.major,
        jobCategory: data.jobCategory,
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        yearsOfExperience: safeInt(data.yearsOfExperience),
        skills: data.skills || [],

        // Commitment
        willingnessToServe: data.willingnessToServe,
        interestAreas: data.interestAreas || [],
        contributionTypes: data.contributionTypes || [],

        // Step 3: Professional Family Members
        professionalFamilyMembers: data.professionalFamilyMembers || [],

        // Step 4: Education (Children)
        educationSchoolingStatus: data.education_schoolingStatus || null,
        educationInSchoolTkPaud: safeInt(data.education_inSchool_tk_paud),
        educationInSchoolSd: safeInt(data.education_inSchool_sd),
        educationInSchoolSmp: safeInt(data.education_inSchool_smp),
        educationInSchoolSma: safeInt(data.education_inSchool_sma),
        educationInSchoolUniversity: safeInt(data.education_inSchool_university),
        educationDropoutTkPaud: safeInt(data.education_dropout_tk_paud),
        educationDropoutSd: safeInt(data.education_dropout_sd),
        educationDropoutSmp: safeInt(data.education_dropout_smp),
        educationDropoutSma: safeInt(data.education_dropout_sma),
        educationDropoutUniversity: safeInt(data.education_dropout_university),
        educationUnemployedSd: safeInt(data.education_unemployed_sd),
        educationUnemployedSmp: safeInt(data.education_unemployed_smp),
        educationUnemployedSma: safeInt(data.education_unemployed_sma),
        educationUnemployedUniversity: safeInt(data.education_unemployed_university),
        educationWorking: safeInt(data.education_working),
        educationHasScholarship: data.education_hasScholarship || null,
        educationScholarshipType: data.education_scholarshipType || null,
        educationScholarshipTypeOther: data.education_scholarshipTypeOther || null,

        // Step 5: Economics — Occupation & Income
        economicsHeadOccupation: data.economics_headOccupation || null,
        economicsHeadOccupationOther: data.economics_headOccupationOther || null,
        economicsHeadIncomeRange: data.economics_headIncomeRange || null,
        economicsHeadIncomeRangeDetailed: data.economics_headIncomeRangeDetailed || null,
        economicsSpouseOccupation: data.economics_spouseOccupation || null,
        economicsSpouseOccupationOther: data.economics_spouseOccupationOther || null,
        economicsSpouseIncomeRange: data.economics_spouseIncomeRange || null,
        economicsSpouseIncomeRangeDetailed: data.economics_spouseIncomeRangeDetailed || null,
        economicsIncomeRange: data.economics_incomeRange || null,
        economicsIncomeRangeDetailed: data.economics_incomeRangeDetailed || null,

        // Step 5: Household Expenses
        economicsExpenseFood: safeInt(data.economics_expense_food),
        economicsExpenseUtilities: safeInt(data.economics_expense_utilities),
        economicsExpenseNonPanganII: safeInt(data.economics_expense_nonPanganII),
        economicsExpenseLoan: safeInt(data.economics_expense_loan),
        economicsExpenseEducation: safeInt(data.economics_expense_education),
        economicsExpenseOther: safeInt(data.economics_expense_other),
        economicsExpenseUnexpected: safeInt(data.economics_expense_unexpected),
        economicsExpenseWorship: safeInt(data.economics_expense_worship),

        // Step 5: Business Ownership
        economicsHasBusiness: data.economics_hasBusiness || null,
        economicsBusinessName: data.economics_businessName || null,
        economicsBusinessType: data.economics_businessType || null,
        economicsBusinessTypeOther: data.economics_businessTypeOther || null,
        economicsBusinessDuration: data.economics_businessDuration || null,
        economicsBusinessDurationYears: safeInt(data.economics_businessDurationYears),
        economicsBusinessStatus: data.economics_businessStatus || null,
        economicsBusinessStatusOther: data.economics_businessStatusOther || null,
        economicsBusinessLocation: data.economics_businessLocation || null,
        economicsBusinessLocationOther: data.economics_businessLocationOther || null,
        economicsBusinessEmployeeCount: data.economics_businessEmployeeCount || null,
        economicsBusinessCapital: safeInt(data.economics_businessCapital),
        economicsBusinessCapitalSource: data.economics_businessCapitalSource || null,
        economicsBusinessCapitalSourceOther: data.economics_businessCapitalSourceOther || null,
        economicsBusinessPermit: data.economics_businessPermit || [],
        economicsBusinessPermitOther: data.economics_businessPermitOther || null,
        economicsBusinessTurnover: data.economics_businessTurnover || null,
        economicsBusinessTurnoverValue: safeInt(data.economics_businessTurnoverValue),
        economicsBusinessMarketing: data.economics_businessMarketing || [],
        economicsBusinessMarketingOther: data.economics_businessMarketingOther || null,
        economicsBusinessMarketArea: data.economics_businessMarketArea || null,
        economicsBusinessIssues: safeString(data.economics_businessIssues),
        economicsBusinessIssuesOther: safeString(data.economics_businessIssuesOther),
        economicsBusinessNeeds: safeString(data.economics_businessNeeds),
        economicsBusinessNeedsOther: safeString(data.economics_businessNeedsOther),
        economicsBusinessSharing: safeString(data.economics_businessSharing),
        economicsBusinessTraining: safeString(data.economics_businessTraining),
        economicsBusinessTrainingOther: safeString(data.economics_businessTrainingOther),

        // Step 5: Home & Assets
        economicsHouseStatus: data.economics_houseStatus || null,
        economicsHouseType: data.economics_houseType || null,
        economicsHouseIMB: data.economics_houseIMB || null,
        economicsHasAssets: data.economics_hasAssets || null,
        economicsTotalAssets: safeInt(data.economics_totalAssets),
        economicsAssets: data.economics_assets || [],
        economicsAssetMotorQty: safeInt(data.economics_asset_motor_qty),
        economicsAssetMobilQty: safeInt(data.economics_asset_mobil_qty),
        economicsAssetKulkasQty: safeInt(data.economics_asset_kulkas_qty),
        economicsAssetLaptopQty: safeInt(data.economics_asset_laptop_qty),
        economicsAssetTvQty: safeInt(data.economics_asset_tv_qty),
        economicsAssetInternetQty: safeInt(data.economics_asset_internet_qty),
        economicsAssetLahanQty: safeInt(data.economics_asset_lahan_qty),
        economicsLandStatus: data.economics_landStatus || null,
        economicsWaterSource: data.economics_waterSource || [],
        economicsElectricityCapacities: data.economics_electricity_capacities || [],
        economicsElectricity450Qty: safeInt(data.economics_electricity_450_qty),
        economicsElectricity900Qty: safeInt(data.economics_electricity_900_qty),
        economicsElectricity1200Qty: safeInt(data.economics_electricity_1200_qty),
        economicsElectricity2200Qty: safeInt(data.economics_electricity_2200_qty),
        economicsElectricity5000Qty: safeInt(data.economics_electricity_5000_qty),
        economicsElectricityTotalCost: safeInt(data.economics_electricity_total_cost),

        // Step 6: Health
        healthSick30Days: data.health_sick30Days || null,
        healthChronicSick: data.health_chronicSick || null,
        healthChronicDisease: data.health_chronicDisease || [],
        healthChronicDiseaseOther: data.health_chronicDiseaseOther || null,
        healthHasBPJS: data.health_hasBPJS || null,
        healthBpjsNonParticipants: data.health_bpjsNonParticipants || null,
        healthRegularTreatment: data.health_regularTreatment || null,
        healthHasBPJSKetenagakerjaan: data.health_hasBPJSKetenagakerjaan || null,
        healthSocialAssistance: data.health_socialAssistance || null,
        healthHasDisability: data.health_hasDisability || null,
        healthDisabilityPhysical: data.health_disabilityPhysical || [],
        healthDisabilityPhysicalOther: data.health_disabilityPhysicalOther || null,
        healthDisabilityIntellectual: data.health_disabilityIntellectual || [],
        healthDisabilityIntellectualOther: data.health_disabilityIntellectualOther || null,
        healthDisabilityMental: data.health_disabilityMental || [],
        healthDisabilityMentalOther: data.health_disabilityMentalOther || null,
        healthDisabilitySensory: data.health_disabilitySensory || [],
        healthDisabilitySensoryOther: data.health_disabilitySensoryOther || null,
        healthDisabilityDouble: data.health_disabilityDouble || false,

        // Geo
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        status: isAdmin ? (data.status || 'VALIDATED') : 'PENDING',
    };
};

// Helper: Clean data before inserting into DB
// This ensures empty strings are converted to null for optional fields
const cleanCongregantData = (data: any) => {
    const cleanedData: any = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            // Convert empty strings to null, but keep 0 as 0
            if (typeof value === 'string' && value.trim() === '') {
                cleanedData[key] = null;
            } else if (Array.isArray(value) && value.length === 0) {
                // Convert empty arrays to null for JSON columns if they are optional
                // This might need more specific handling depending on schema,
                // but for now, general empty array to null conversion.
                cleanedData[key] = null;
            }
            else {
                cleanedData[key] = value;
            }
        }
    }
    return cleanedData;
};

// 2. POST Member (Admin)
app.post("/api/members", async (req, res) => {
    try {
        const data = req.body;
        const values = cleanCongregantData(buildCongregantValues(data, true));
        await db.insert(congregants).values(values);
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
        console.log("New Registration Attempt:", data.fullName || data.name);

        const values = cleanCongregantData(buildCongregantValues(data, false));
        const [result] = await db.insert(congregants).values(values);

        console.log("Registration Successful:", data.fullName, "ID:", result.insertId);
        res.status(201).json({ success: true, message: "Pendaftaran berhasil", id: result.insertId });
    } catch (error) {
        console.error("Submission Error:", error);
        console.error("Error saving congregant:", error);
        res.status(500).json({ error: "Gagal menyimpan data pendaftaran. Pastikan data lengkap." });
    }
});

// 2c. Public: Check Registration Status by ID (No Auth)
app.get("/api/congregants/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.select({
            id: congregants.id,
            fullName: congregants.fullName,
            kkNumber: congregants.kkNumber,
            lingkungan: congregants.lingkungan,
            rayon: congregants.rayon,
            phone: congregants.phone,
            status: congregants.status,
            createdAt: congregants.createdAt,
            updatedAt: congregants.updatedAt,
        }).from(congregants).where(eq(congregants.id, Number(id))).limit(1);

        if (!result || result.length === 0) {
            res.status(404).json({ error: "ID Registrasi tidak ditemukan" });
            return;
        }

        const r = result[0];

        // Look up pendamping (Ketua Lingkungan) by lingkungan
        let ketuaLingkungan = '';
        if (r.lingkungan) {
            const pendampingResult = await db.select({ name: pendamping.name })
                .from(pendamping)
                .where(eq(pendamping.lingkungan, r.lingkungan))
                .limit(1);
            if (pendampingResult.length > 0) {
                ketuaLingkungan = pendampingResult[0].name;
            }
        }

        res.json({
            id: r.id,
            displayId: `REG-${r.id.toString().padStart(4, '0')}`,
            fullName: r.fullName,
            kkNumber: r.kkNumber,
            lingkungan: r.lingkungan,
            rayon: r.rayon,
            phone: r.phone,
            status: r.status,
            ketuaLingkungan,
            createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
            updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : null,
        });
    } catch (error) {
        console.error("Status Check Error:", error);
        res.status(500).json({ error: "Gagal mengambil status registrasi" });
    }
});

// Get pendamping name by lingkungan (public, for PDF generation)
app.get("/api/pendamping-by-lingkungan/:lingkungan", async (req, res) => {
    try {
        const { lingkungan } = req.params;
        const result = await db.select({ name: pendamping.name })
            .from(pendamping)
            .where(eq(pendamping.lingkungan, lingkungan))
            .limit(1);
        if (result.length === 0) {
            return res.json({ name: '' });
        }
        res.json({ name: result[0].name });
    } catch (error) {
        console.error("Failed to get pendamping by lingkungan:", error);
        res.json({ name: '' });
    }
});

// Verify/Reject a member's registration status
app.put("/api/members/:id/verify", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['PENDING', 'VALIDATED'].includes(status)) {
            return res.status(400).json({ error: "Status must be 'PENDING' or 'VALIDATED'" });
        }

        await db.update(congregants).set({
            status,
            updatedAt: new Date()
        }).where(eq(congregants.id, Number(id)));

        res.json({ success: true });
    } catch (error) {
        console.error("Failed to verify member:", error);
        res.status(500).json({ error: "Failed to verify member" });
    }
});

// 3. PUT Member
app.put("/api/members/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const { status, ...updateValues } = buildCongregantValues(data, true);

        await db.update(congregants)
            .set(updateValues)
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
        const { rayon, lingkungan } = req.query;
        // Base where condition based on filters
        const filters = [];
        if (rayon && rayon !== 'Semua') filters.push(eq(congregants.rayon, rayon as string));
        if (lingkungan && lingkungan !== 'Semua') filters.push(eq(congregants.lingkungan, lingkungan as string));
        const baseWhere = filters.length > 0 ? and(...filters) : undefined;

        console.log(`[Stats] Fetching dashboard stats for Rayon: ${rayon || 'Semua'}, Lingkungan: ${lingkungan || 'Semua'}`);

        // Parallel queries for performance
        const [totalRes, soulsRes, genderRes, willingnessRes, educationRes, skillsRes, professionalRes, lingkunganRes, rayonRes, eduSumRes, diakoniaRes, economicsRes, healthRes] = await Promise.all([
            // 1. Total Households (Records)
            db.select({ count: sql<number>`count(*)` }).from(congregants).where(baseWhere),

            // 1b. Total Souls (Aggregated Family Members)
            db.select({
                totalSouls: sql<number>`SUM(family_members)`,
                totalMale: sql<number>`SUM(family_members_male)`,
                totalFemale: sql<number>`SUM(family_members_female)`,
                totalSidi: sql<number>`SUM(family_members_sidi)`
            }).from(congregants),

            // 2. Gender of Head
            db.select({ gender: congregants.gender, count: sql<number>`count(*)` }).from(congregants).where(baseWhere).groupBy(congregants.gender),

            // 4. Willingness Distribution
            db.select({ willingness: congregants.willingnessToServe, count: sql<number>`count(*)` }).from(congregants).where(baseWhere).groupBy(congregants.willingnessToServe),

            // 5. Education Distribution
            db.select({ education: congregants.educationLevel, count: sql<number>`count(*)` }).from(congregants).where(baseWhere).groupBy(congregants.educationLevel),
            // 6. Skills (Get all skills to parse and sum)
            db.select({ skills: congregants.skills }).from(congregants).where(baseWhere),

            // 7. Professional Count (Filter out non-working categories)
            db.select({ count: sql<number>`count(*)` })
                .from(congregants)
                .where(and(baseWhere, notInArray(congregants.jobCategory, ['Pelajar / Mahasiswa', 'Mengurus Rumah Tangga', 'Pensiunan', 'Belum Bekerja', '-']))),

            // 8. Lingkungan Distribution
            db.select({ lingkungan: congregants.lingkungan, count: sql<number>`count(*)` }).from(congregants).where(baseWhere).groupBy(congregants.lingkungan),

            // 9. Rayon Distribution
            db.select({ rayon: congregants.rayon, count: sql<number>`count(*)` }).from(congregants).where(baseWhere).groupBy(congregants.rayon),

            // 10. Education Summary (All Child Data)
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

            // 11. Diakonia
            db.select({ type: congregants.diakoniaType, count: sql<number>`count(*)` }).from(congregants).where(and(baseWhere, eq(congregants.diakoniaRecipient, 'Ya'))).groupBy(congregants.diakoniaType),

            // 12. Economics Raw Data (for processing assets, issues etc)
            db.select({
                assets: congregants.economicsAssets,
                businessType: congregants.economicsBusinessType,
                businessTurnover: congregants.economicsBusinessTurnover,
                businessIssues: congregants.economicsBusinessIssues,
                businessTraining: congregants.economicsBusinessTraining,
                businessNeeds: congregants.economicsBusinessNeeds,
                waterSource: congregants.economicsWaterSource
            }).from(congregants).where(baseWhere),

            // 13. Health Raw Data (for processing disabilities and chronics)
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

        const total = totalRes[0]?.count || 0;
        const soulsData = soulsRes[0] || { totalSouls: 0, totalMale: 0, totalFemale: 0, totalSidi: 0 };
        const totalSouls = Number(soulsData.totalSouls) || total; // Fallback to records count if SUM is 0

        // Process Gender (Overall souls if possible, else heads)
        const genderCounts: Record<string, number> = {
            "Laki-laki": Number(soulsData.totalMale) || 0,
            "Perempuan": Number(soulsData.totalFemale) || 0
        };
        // If no family data, fallback to gender of heads
        if (genderCounts["Laki-laki"] === 0 && genderCounts["Perempuan"] === 0) {
            genderRes.forEach(g => { if (g.gender) genderCounts[g.gender] = g.count; });
        }

        // Process Lingkungan
        const lingkunganCounts: Record<string, number> = {};
        lingkunganRes.forEach(l => { if (l.lingkungan) lingkunganCounts[l.lingkungan] = l.count; });

        // Process Rayon
        const rayonCounts: Record<string, number> = {};
        rayonRes.forEach(r => { if (r.rayon) rayonCounts[r.rayon] = r.count; });

        // 11. Process Diakonia
        const diakoniaCounts: Record<string, number> = {};
        diakoniaRes.forEach(d => { if (d.type) diakoniaCounts[d.type] = d.count; });

        // 12. Process Economics (Assets, UMKM)
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

            // Assets
            if (e.assets) {
                try {
                    const parsed = typeof e.assets === 'string' ? JSON.parse(e.assets) : e.assets;
                    if (Array.isArray(parsed)) {
                        parsed.forEach(a => { assetsCount[a] = (assetsCount[a] || 0) + 1; });
                    }
                } catch (err) { }
            }
            // UMKM Stats
            if (e.businessType) {
                if (e.businessTurnover) businessTurnoverCount[e.businessTurnover] = (businessTurnoverCount[e.businessTurnover] || 0) + 1;

                if (e.businessIssues) businessIssuesCount[e.businessIssues] = (businessIssuesCount[e.businessIssues] || 0) + 1;
                if (e.businessTraining) businessTrainingCount[e.businessTraining] = (businessTrainingCount[e.businessTraining] || 0) + 1;
                if (e.businessNeeds) businessNeedsCount[e.businessNeeds] = (businessNeedsCount[e.businessNeeds] || 0) + 1;
            }
        });

        // 13. Process Health (Disabilities & Chronics)
        const disabilityCount: Record<string, number> = {
            "Fisik": 0, "Intelektual": 0, "Mental": 0, "Sensorik": 0
        };
        const chronicCount: Record<string, number> = {};
        let sick30DaysCount = 0;
        let regularTreatmentCount = 0;

        healthRes.forEach(h => {
            if (h.sick30Days === 'Ya') sick30DaysCount++;
            if (h.regularTreatment === 'Ya') regularTreatmentCount++;
            // Disabilities
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

            // Chronics
            if (h.chronicDisease) {
                try {
                    const parsed = typeof h.chronicDisease === 'string' ? JSON.parse(h.chronicDisease) : h.chronicDisease;
                    if (Array.isArray(parsed)) {
                        parsed.forEach(c => { chronicCount[c] = (chronicCount[c] || 0) + 1; });
                    }
                } catch (err) { }
            }
        });

        // Process Willingness
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

        // 8. Professional Family Members Count
        const profFamilyRes = await db.select({ pfm: congregants.professionalFamilyMembers }).from(congregants).where(baseWhere);
        let professionalFamilyCount = 0;
        profFamilyRes.forEach(row => {
            try {
                const pfm = typeof row.pfm === 'string' ? JSON.parse(row.pfm) : row.pfm;
                if (Array.isArray(pfm)) {
                    professionalFamilyCount += pfm.length;
                }
            } catch (e) {
                // Ignore parsing errors
            }
        });


        res.json({
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
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

const upload = multer({ dest: "uploads/" });

// 6. Bulk Import CSV
app.post("/api/members/import", upload.single('file'), async (req, res) => {
    const file = (req as any).file;
    if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
    }

    const results: any[] = [];
    require('fs').createReadStream(file.path)
        .pipe(csv())
        .on('data', (data: any) => results.push(data))
        .on('end', async () => {
            try {
                const safeInt = (val: any) => {
                    const n = parseInt(val);
                    return isNaN(n) ? 0 : n;
                };

                const safeJSON = (val: any) => {
                    if (!val) return [];
                    if (typeof val === 'string' && val.includes(';')) {
                        return val.split(';').map(s => s.trim()).filter(Boolean);
                    }
                    return [val];
                };

                // Enhanced mapping for all fields
                const insertData = results.map(row => ({
                    kkNumber: row["Nomor Kartu Keluarga"] || null,
                    nik: row["NIK"] || null,
                    fullName: row["Nama Lengkap Kepala Keluarga"] || row["Nama"] || row["Name"] || "Tanpa Nama",
                    gender: row["Jenis Kelamin"] || "Laki-laki",
                    dateOfBirth: safeDateForDB(row["Tanggal Lahir"]),
                    phone: row["Nomor Telepon/ WhatsApp Aktif"] || null,
                    lingkungan: row["Lingkungan"] || "-",
                    rayon: row["Rayon"] || "-",
                    address: row["Alamat Lengkap"] || null,

                    // Family
                    familyMembers: safeInt(row["Total Anggota Keluarga"]),
                    familyMembersMale: safeInt(row["Laki-laki"]),
                    familyMembersFemale: safeInt(row["Perempuan"]),
                    familyMembersOutside: safeInt(row["Di Luar Kota"]),
                    familyMembersSidi: safeInt(row["Sudah Sidi"]),
                    familyMembersSidiMale: safeInt(row["Sidi Laki-laki"]),
                    familyMembersSidiFemale: safeInt(row["Sidi Perempuan"]),
                    familyMembersNonBaptized: safeInt(row["Belum Baptis"]),
                    familyMembersNonSidi: safeInt(row["Belum Sidi"]),

                    // Diakonia
                    diakoniaRecipient: row["Penerima Diakonia"] || "Tidak",
                    diakoniaYear: row["Tahun Diakonia"] || null,
                    diakoniaType: row["Jenis Diakonia"] || null,

                    // Professional
                    educationLevel: row["Pendidikan Terakhir"] || row["Pendidikan"] || "SMA",
                    major: row["Jurusan"] || null,
                    jobCategory: row["Kategori Pekerjaan"] || row["Pekerjaan"] || "Belum Bekerja",
                    jobTitle: row["Jabatan"] || null,
                    companyName: row["Nama Instansi"] || null,
                    yearsOfExperience: safeInt(row["Lama Kerja (Tahun)"]),
                    skills: safeJSON(row["Daftar Keahlian"] || row["Keahlian"]),

                    // Commitment
                    willingnessToServe: row["Kesediaan Melayani"] || "Not-available",
                    interestAreas: safeJSON(row["Minat Pelayanan"]),
                    contributionTypes: safeJSON(row["Bentuk Kontribusi"]),

                    // Education (Children)
                    educationSchoolingStatus: row["Status Anak Bersekolah"] || "Tidak Ada",
                    educationInSchoolTkPaud: safeInt(row["TK/PAUD (Sekolah)"]),
                    educationInSchoolSd: safeInt(row["SD (Sekolah)"]),
                    educationInSchoolSmp: safeInt(row["SMP (Sekolah)"]),
                    educationInSchoolSma: safeInt(row["SMA (Sekolah)"]),
                    educationInSchoolUniversity: safeInt(row["Universitas (Sekolah)"]),
                    educationDropoutTkPaud: safeInt(row["TK/PAUD (Putus)"]),
                    educationDropoutSd: safeInt(row["SD (Putus)"]),
                    educationDropoutSmp: safeInt(row["SMP (Putus)"]),
                    educationDropoutSma: safeInt(row["SMA (Putus)"]),
                    educationDropoutUniversity: safeInt(row["Universitas (Putus)"]),
                    educationWorking: safeInt(row["Anak Sudah Bekerja"]),

                    // Economics
                    economicsHeadOccupation: row["Pekerjaan KK"] || null,
                    economicsSpouseOccupation: row["Pekerjaan Pasangan"] || null,
                    economicsIncomeRange: row["Range Pendapatan"] || null,
                    economicsExpenseFood: safeInt(row["Pengeluaran Pangan"]),
                    economicsExpenseUtilities: safeInt(row["Pengeluaran Utilitas"]),
                    economicsExpenseEducation: safeInt(row["Pengeluaran Pendidikan"]),
                    economicsExpenseOther: safeInt(row["Pengeluaran Lainnya"]),
                    economicsHasBusiness: row["Punya Usaha?"] || "Tidak",
                    economicsBusinessName: row["Nama Usaha"] || null,
                    economicsBusinessType: row["Jenis Usaha"] || null,
                    economicsHouseStatus: row["Status Rumah"] || null,
                    economicsHouseType: row["Jenis Rumah"] || null,
                    economicsWaterSource: safeJSON(row["Sumber Air"]),
                    economicsAssets: safeJSON(row["Daftar Aset"]),

                    // Health
                    healthSick30Days: row["Sakit 30 Hari Terakhir"] || "Tidak",
                    healthChronicSick: row["Penyakit Kronis"] || "Tidak",
                    healthChronicDisease: safeJSON(row["Daftar Penyakit"]),
                    healthHasBPJS: row["BPJS Kesehatan"] || "Tidak",
                    healthHasBPJSKetenagakerjaan: row["BPJS Ketenagakerjaan"] || "Tidak",
                    healthSocialAssistance: row["Bantuan Sosial"] || "Tidak",
                    healthHasDisability: row["Disabilitas"] || "Tidak",
                    healthDisabilityPhysical: safeJSON(row["Daftar Disabilitas"]),
                    marriageDate: safeDateForDB(row["Tanggal Pernikahan"]),

                    // Geolocation
                    latitude: row["Latitude"] || "-10.1633",
                    longitude: row["Longitude"] || "123.6083",

                    status: 'VALIDATED'
                }));

                if (insertData.length > 0) {
                    await db.insert(congregants).values(insertData);
                }

                require('fs').unlinkSync(file.path);
                res.json({ success: true, count: insertData.length });
            } catch (error) {
                console.error("Import error:", error);
                res.status(500).json({ error: "Failed to import data. Check CSV headers." });
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

// Centralized Error Handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

// ----------------------------------------------------
// User Role Endpoint
// ----------------------------------------------------

app.get("/api/user/role", async (req, res) => {
    try {
        const session = await auth.api.getSession({ headers: req.headers as any });
        if (!session?.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }
        const userData = await db.select().from(user).where(eq(user.id, session.user.id));
        if (userData.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ role: userData[0].role || 'admin', name: userData[0].name });
    } catch (error) {
        console.error("Failed to get user role:", error);
        res.status(500).json({ error: "Failed to get user role" });
    }
});

// ----------------------------------------------------
// User Credential Management
// ----------------------------------------------------

app.post("/api/credentials", async (req, res) => {
    try {
        const { email, password, name, entityType, entityId } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: "Email, password, dan nama wajib diisi" });
        }

        // Check if user with this email already exists
        const existingUser = await db.select().from(user).where(eq(user.email, email));

        if (existingUser.length > 0) {
            // Update existing user's password via account table
            const bcrypt = await import("bcryptjs");
            const hashedPassword = await bcrypt.hash(password, 10);

            await db.update(account)
                .set({ password: hashedPassword })
                .where(eq(account.userId, existingUser[0].id));

            // Also update the name
            await db.update(user)
                .set({ name })
                .where(eq(user.id, existingUser[0].id));
        } else {
            // Create new user via Better Auth signUp
            const signUpResult = await auth.api.signUpEmail({
                body: { email, password, name }
            });

            if (!signUpResult || !signUpResult.user) {
                return res.status(500).json({ error: "Gagal membuat akun" });
            }

            // Set role based on entityType
            const role = entityType === 'enumerator' ? 'enumerator' : entityType === 'pendamping' ? 'pendamping' : 'admin';
            await db.update(user).set({ role }).where(eq(user.id, signUpResult.user.id));
        }

        // Store plain text credentials in enumerator/pendamping table
        if (entityType === 'enumerator' && entityId) {
            await db.update(enumerators)
                .set({ loginEmail: email, loginPassword: password })
                .where(eq(enumerators.id, Number(entityId)));
        } else if (entityType === 'pendamping' && entityId) {
            await db.update(pendamping)
                .set({ loginEmail: email, loginPassword: password })
                .where(eq(pendamping.id, Number(entityId)));
        }

        res.json({ success: true, message: existingUser.length > 0 ? "Akun berhasil diperbarui" : "Akun berhasil dibuat" });
    } catch (error: any) {
        console.error("Failed to manage credentials:", error);
        res.status(500).json({ error: error.message || "Gagal mengelola akun" });
    }
});

app.get("/api/credentials/check/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const existingUser = await db.select().from(user).where(eq(user.email, email));
        res.json({ exists: existingUser.length > 0, user: existingUser[0] || null });
    } catch (error) {
        console.error("Failed to check user:", error);
        res.status(500).json({ error: "Failed to check user" });
    }
});

// ----------------------------------------------------
// Enumerator Endpoints
// ----------------------------------------------------

app.post("/api/enumerators", async (req, res) => {
    try {
        const { name, rayon, lingkungan, familyCount, whatsapp, loginEmail, loginPassword } = req.body;
        const result = await db.insert(enumerators).values({
            name,
            rayon,
            lingkungan,
            familyCount: familyCount ? Number(familyCount) : 0,
            whatsapp: whatsapp || null,
            loginEmail: loginEmail || null,
            loginPassword: loginPassword || null
        });

        // If login credentials provided, create Better Auth user account
        if (loginEmail && loginPassword) {
            try {
                const existingUser = await db.select().from(user).where(eq(user.email, loginEmail));
                if (existingUser.length === 0) {
                    const signUpResult = await auth.api.signUpEmail({
                        body: { email: loginEmail, password: loginPassword, name }
                    });
                    // Set role to enumerator
                    if (signUpResult?.user) {
                        await db.update(user).set({ role: 'enumerator' }).where(eq(user.id, signUpResult.user.id));
                    }
                }
            } catch (authError) {
                console.error("Failed to create auth account for enumerator:", authError);
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Failed to create enumerator:", error);
        res.status(500).json({ error: "Failed to create enumerator" });
    }
});

app.get("/api/enumerators", async (req, res) => {
    try {
        const result = await db.select().from(enumerators).orderBy(desc(enumerators.createdAt));

        // Get valid visit counts per enumerator
        const visitCounts = await db.select({
            enumeratorId: visits.enumeratorId,
            validCount: count()
        }).from(visits).where(eq(visits.status, 'valid')).groupBy(visits.enumeratorId);

        const countMap = Object.fromEntries(visitCounts.map(v => [v.enumeratorId, v.validCount]));

        const enriched = result.map(e => ({
            ...e,
            validVisitCount: countMap[e.id] || 0
        }));

        res.json(enriched);
    } catch (error) {
        console.error("Failed to fetch enumerators:", error);
        res.status(500).json({ error: "Failed to fetch enumerators" });
    }
});

app.delete("/api/enumerators/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.delete(enumerators).where(eq(enumerators.id, Number(id)));
        res.json({ success: true });
    } catch (error) {
        console.error("Failed to delete enumerator:", error);
        res.status(500).json({ error: "Failed to delete enumerator" });
    }
});

// ----------------------------------------------------
// Pendamping Lingkungan Endpoints
// ----------------------------------------------------

app.post("/api/pendamping", async (req, res) => {
    try {
        const { name, lingkungan, whatsapp, loginEmail, loginPassword } = req.body;

        // Count enumerators in this lingkungan
        const enumeratorResult = await db.select({ count: sql<number>`count(*)` })
            .from(enumerators)
            .where(eq(enumerators.lingkungan, lingkungan));
        const calculatedEnumeratorCount = enumeratorResult[0]?.count || 0;

        // Count families (congregants) in this lingkungan
        const familyResult = await db.select({ count: sql<number>`count(*)` })
            .from(congregants)
            .where(eq(congregants.lingkungan, lingkungan));
        const calculatedFamilyCount = familyResult[0]?.count || 0;

        await db.insert(pendamping).values({
            name,
            lingkungan,
            familyCount: calculatedFamilyCount,
            enumeratorCount: calculatedEnumeratorCount,
            whatsapp: whatsapp || null,
            loginEmail: loginEmail || null,
            loginPassword: loginPassword || null
        });

        // If login credentials provided, create Better Auth user account
        if (loginEmail && loginPassword) {
            try {
                const existingUser = await db.select().from(user).where(eq(user.email, loginEmail));
                if (existingUser.length === 0) {
                    const signUpResult = await auth.api.signUpEmail({
                        body: { email: loginEmail, password: loginPassword, name }
                    });
                    // Set role to pendamping
                    if (signUpResult?.user) {
                        await db.update(user).set({ role: 'pendamping' }).where(eq(user.id, signUpResult.user.id));
                    }
                }
            } catch (authError) {
                console.error("Failed to create auth account for pendamping:", authError);
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Failed to create pendamping:", error);
        res.status(500).json({ error: "Failed to create pendamping" });
    }
});

app.get("/api/pendamping", async (req, res) => {
    try {
        const result = await db.select().from(pendamping).orderBy(desc(pendamping.createdAt));

        // Dynamically update enumeratorCount and familyCount for each pendamping
        const updatedResult = await Promise.all(result.map(async (p) => {
            const enumeratorResult = await db.select({ count: sql<number>`count(*)` })
                .from(enumerators)
                .where(eq(enumerators.lingkungan, p.lingkungan));
            const enumeratorCount = enumeratorResult[0]?.count || 0;

            const familyResult = await db.select({ count: sql<number>`count(*)` })
                .from(congregants)
                .where(eq(congregants.lingkungan, p.lingkungan));
            const familyCount = familyResult[0]?.count || 0;

            return {
                ...p,
                enumeratorCount,
                familyCount
            };
        }));

        res.json(updatedResult);
    } catch (error) {
        console.error("Failed to fetch pendamping:", error);
        res.status(500).json({ error: "Failed to fetch pendamping" });
    }
});

app.delete("/api/pendamping/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.delete(pendamping).where(eq(pendamping.id, Number(id)));
        res.json({ success: true });
    } catch (error) {
        console.error("Failed to delete pendamping:", error);
        res.status(500).json({ error: "Failed to delete pendamping" });
    }
});

// ----------------------------------------------------
// Enumerator Visit Endpoints
// ----------------------------------------------------

// Configure multer for visit photos
const visitPhotoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "uploads/visits";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        cb(null, `visit_${Date.now()}.${ext}`);
    }
});
const visitUpload = multer({ storage: visitPhotoStorage });

// Serve uploaded visit photos
app.use("/uploads/visits", express.static("uploads/visits"));

// Get current enumerator info by session
app.get("/api/enumerator/me", async (req, res) => {
    try {
        const session = await auth.api.getSession({ headers: req.headers as any });
        if (!session?.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        // Find enumerator matching the user's email
        const enumeratorData = await db.select().from(enumerators).where(eq(enumerators.loginEmail, session.user.email));
        if (enumeratorData.length === 0) {
            return res.status(404).json({ error: "Enumerator not found" });
        }

        res.json({
            ...enumeratorData[0],
            userName: session.user.name
        });
    } catch (error) {
        console.error("Failed to get enumerator info:", error);
        res.status(500).json({ error: "Failed to get enumerator info" });
    }
});

// Get families (congregants) in the enumerator's lingkungan
app.get("/api/enumerator/families", async (req, res) => {
    try {
        const session = await auth.api.getSession({ headers: req.headers as any });
        if (!session?.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const enumeratorData = await db.select().from(enumerators).where(eq(enumerators.loginEmail, session.user.email));
        if (enumeratorData.length === 0) {
            return res.status(404).json({ error: "Enumerator not found" });
        }

        const lingkungan = enumeratorData[0].lingkungan;

        // Get IDs of families already visited by ANY enumerator
        const visitedFamilies = await db.select({ congregantId: visits.congregantId }).from(visits);
        const visitedIds = visitedFamilies.map(v => v.congregantId);

        // Get families in this lingkungan, excluding already visited ones
        let familyQuery = db.select({
            id: congregants.id,
            fullName: congregants.fullName,
            address: congregants.address,
            lingkungan: congregants.lingkungan,
            rayon: congregants.rayon
        }).from(congregants).where(
            visitedIds.length > 0
                ? and(eq(congregants.lingkungan, lingkungan), notInArray(congregants.id, visitedIds))
                : eq(congregants.lingkungan, lingkungan)
        );

        const families = await familyQuery;

        res.json(families);
    } catch (error) {
        console.error("Failed to get families:", error);
        res.status(500).json({ error: "Failed to get families" });
    }
});

// Get visits for the current enumerator
app.get("/api/enumerator/visits", async (req, res) => {
    try {
        const session = await auth.api.getSession({ headers: req.headers as any });
        if (!session?.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const enumeratorData = await db.select().from(enumerators).where(eq(enumerators.loginEmail, session.user.email));
        if (enumeratorData.length === 0) {
            return res.status(404).json({ error: "Enumerator not found" });
        }

        const visitList = await db.select().from(visits)
            .where(eq(visits.enumeratorId, enumeratorData[0].id))
            .orderBy(desc(visits.createdAt));

        res.json(visitList);
    } catch (error) {
        console.error("Failed to get visits:", error);
        res.status(500).json({ error: "Failed to get visits" });
    }
});

// Submit a new visit
app.post("/api/enumerator/visits", visitUpload.single("photo"), async (req, res) => {
    try {
        const session = await auth.api.getSession({ headers: req.headers as any });
        if (!session?.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const enumeratorData = await db.select().from(enumerators).where(eq(enumerators.loginEmail, session.user.email));
        if (enumeratorData.length === 0) {
            return res.status(404).json({ error: "Enumerator not found" });
        }

        const { congregantId, congregantName, notes } = req.body;
        const file = (req as any).file;
        const photoUrl = file ? `/uploads/visits/${file.filename}` : null;

        await db.insert(visits).values({
            enumeratorId: enumeratorData[0].id,
            congregantId: Number(congregantId),
            congregantName,
            photoUrl,
            notes: notes || null
        });

        res.json({ success: true, message: "Kunjungan berhasil disimpan" });
    } catch (error) {
        console.error("Failed to create visit:", error);
        res.status(500).json({ error: "Failed to create visit" });
    }
});

// Delete a visit
app.delete("/api/enumerator/visits/:id", async (req, res) => {
    try {
        const session = await auth.api.getSession({ headers: req.headers as any });
        if (!session?.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const { id } = req.params;
        await db.delete(visits).where(eq(visits.id, Number(id)));
        res.json({ success: true });
    } catch (error) {
        console.error("Failed to delete visit:", error);
        res.status(500).json({ error: "Failed to delete visit" });
    }
});

// ----------------------------------------------------
// Pendamping Dashboard Endpoints
// ----------------------------------------------------

// Get current pendamping info by session
app.get("/api/pendamping/me", async (req, res) => {
    try {
        const session = await auth.api.getSession({ headers: req.headers as any });
        if (!session?.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const pendampingData = await db.select().from(pendamping).where(eq(pendamping.loginEmail, session.user.email));
        if (pendampingData.length === 0) {
            return res.status(404).json({ error: "Pendamping not found" });
        }

        res.json({
            ...pendampingData[0],
            userName: session.user.name
        });
    } catch (error) {
        console.error("Failed to get pendamping info:", error);
        res.status(500).json({ error: "Failed to get pendamping info" });
    }
});

// Get pendamping stats
app.get("/api/pendamping/stats", async (req, res) => {
    try {
        const session = await auth.api.getSession({ headers: req.headers as any });
        if (!session?.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const pendampingData = await db.select().from(pendamping).where(eq(pendamping.loginEmail, session.user.email));
        if (pendampingData.length === 0) {
            return res.status(404).json({ error: "Pendamping not found" });
        }

        const ling = pendampingData[0].lingkungan;

        // Count families in this lingkungan
        const familyResult = await db.select({ total: count() }).from(congregants).where(eq(congregants.lingkungan, ling));
        const familyCount = familyResult[0]?.total || 0;

        // Count enumerators in this lingkungan
        const enumResult = await db.select({ total: count() }).from(enumerators).where(eq(enumerators.lingkungan, ling));
        const enumeratorCount = enumResult[0]?.total || 0;

        // Get enumerator IDs in this lingkungan
        const enumIds = await db.select({ id: enumerators.id }).from(enumerators).where(eq(enumerators.lingkungan, ling));
        const enumIdList = enumIds.map(e => e.id);

        // Count visited families (unique congregants from visits by enumerators in this lingkungan)
        let visitedCount = 0;
        if (enumIdList.length > 0) {
            const visitedResult = await db.selectDistinct({ congregantId: visits.congregantId })
                .from(visits)
                .where(sql`${visits.enumeratorId} IN (${sql.join(enumIdList.map(id => sql`${id}`), sql`, `)})`);
            visitedCount = visitedResult.length;
        }

        const unvisitedCount = familyCount - visitedCount;

        res.json({
            familyCount,
            enumeratorCount,
            visitedCount,
            unvisitedCount: Math.max(0, unvisitedCount)
        });
    } catch (error) {
        console.error("Failed to get pendamping stats:", error);
        res.status(500).json({ error: "Failed to get pendamping stats" });
    }
});

// Get all visits in the pendamping's lingkungan (with enumerator name)
app.get("/api/pendamping/visits", async (req, res) => {
    try {
        const session = await auth.api.getSession({ headers: req.headers as any });
        if (!session?.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const pendampingData = await db.select().from(pendamping).where(eq(pendamping.loginEmail, session.user.email));
        if (pendampingData.length === 0) {
            return res.status(404).json({ error: "Pendamping not found" });
        }

        const ling = pendampingData[0].lingkungan;

        // Get enumerator IDs in this lingkungan
        const enumList = await db.select({ id: enumerators.id, name: enumerators.name }).from(enumerators).where(eq(enumerators.lingkungan, ling));
        const enumIdList = enumList.map(e => e.id);

        if (enumIdList.length === 0) {
            return res.json([]);
        }

        // Get all visits from these enumerators
        const visitList = await db.select().from(visits)
            .where(sql`${visits.enumeratorId} IN (${sql.join(enumIdList.map(id => sql`${id}`), sql`, `)})`)
            .orderBy(desc(visits.createdAt));

        // Map enumerator names
        const enumMap = Object.fromEntries(enumList.map(e => [e.id, e.name]));
        const result = visitList.map(v => ({
            ...v,
            enumeratorName: enumMap[v.enumeratorId] || 'Unknown'
        }));

        res.json(result);
    } catch (error) {
        console.error("Failed to get pendamping visits:", error);
        res.status(500).json({ error: "Failed to get pendamping visits" });
    }
});

// Validate a visit (set status to valid/invalid)
app.put("/api/pendamping/visits/:id/validate", async (req, res) => {
    try {
        const session = await auth.api.getSession({ headers: req.headers as any });
        if (!session?.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const { id } = req.params;
        const { status, rejectionReason } = req.body;

        if (!['valid', 'invalid'].includes(status)) {
            return res.status(400).json({ error: "Status must be 'valid' or 'invalid'" });
        }

        await db.update(visits).set({
            status,
            rejectionReason: status === 'invalid' ? rejectionReason : null
        }).where(eq(visits.id, Number(id)));

        res.json({ success: true });
    } catch (error) {
        console.error("Failed to validate visit:", error);
        res.status(500).json({ error: "Failed to validate visit" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
