import "dotenv/config";
import { db } from "./db";
import { congregants } from "./schema";

const safeParseJSON = (str: any) => {
    if (!str) return [];
    try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) return parsed.map(String);
        if (typeof parsed === 'string') return [parsed];
        return [];
    } catch {
        return [str];
    }
};

const mapCongregantToMember = (c: any) => ({
    id: c.id.toString(),
    name: c.fullName,
    lingkungan: c.lingkungan || "-",
    rayon: c.rayon || "-",
    address: c.address || "-",
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
    birthDate: c.dateOfBirth ? new Date(c.dateOfBirth).toISOString().split('T')[0] : "",
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    registrationStatus: c.status || 'PENDING',

    // Step 1: Identity extras
    kkNumber: c.kkNumber || "",
    nik: c.nik || "",
    bloodType: c.bloodType || "",
    maritalStatus: c.maritalStatus || "",
    marriageDate: c.marriageDate ? new Date(c.marriageDate).toISOString().split('T')[0] : "",
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

    // Step 5: Economics
    economics_headOccupation: c.economicsHeadOccupation || "",
    economics_headOccupationOther: c.economicsHeadOccupationOther || "",
    economics_spouseOccupation: c.economicsSpouseOccupation || "",
    economics_spouseOccupationOther: c.economicsSpouseOccupationOther || "",
    economics_incomeRange: c.economicsIncomeRange || "",
    economics_incomeRangeDetailed: c.economicsIncomeRangeDetailed || "",
    economics_expense_food: c.economicsExpenseFood || 0,
    economics_expense_utilities: c.economicsExpenseUtilities || 0,
    economics_expense_education: c.economicsExpenseEducation || 0,
    economics_expense_non_pangan_ii: c.economicsExpenseNonPanganII || 0,
    economics_expense_loan: c.economicsExpenseLoan || 0,
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
    economics_businessIssues: safeParseJSON(c.economicsBusinessIssues),
    economics_businessIssuesOther: c.economicsBusinessIssuesOther || "",
    economics_businessNeeds: safeParseJSON(c.economicsBusinessNeeds),
    economics_businessNeedsOther: c.economicsBusinessNeedsOther || "",
    economics_businessSharing: c.economicsBusinessSharing || "",
    economics_businessTraining: safeParseJSON(c.economicsBusinessTraining),
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
    economics_waterSource: c.economicsWaterSource || "",
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

    // Virtual attributes for grouping (already checked)
});

async function run() {
    try {
        const result = await db.select().from(congregants).limit(5);
        result.map(mapCongregantToMember);
        console.log("Success! Mapped without error.");
    } catch (err) {
        console.error("Mapping Error:", err);
    }
}

run().then(() => process.exit(0));
