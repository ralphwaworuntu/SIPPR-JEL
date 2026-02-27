

export interface ProfessionalFamilyMember {
    name: string;
    hasProfessionalSkill: 'Ya' | 'Tidak' | '';
    skillType: string;
    skillLevel: '1' | '2' | '3' | '';
    workplace: string;
    position: string;
    yearsExperience: string;
    specificSkills: string[];
    churchServiceInterest: string;
    serviceInterestArea: string;
    contributionForm: string[];
    communityConsent: boolean;
}

export interface FormData {
    // Step 1: Identity
    kkNumber: string;
    nik: string;
    fullName: string;
    gender: 'Laki-laki' | 'Perempuan' | '';
    dateOfBirth: string;
    bloodType: string;
    maritalStatus: string;
    marriageDate: string;
    marriageType: string[];
    baptismStatus: 'Sudah' | 'Belum' | '';
    sidiStatus: 'Sudah' | 'Belum' | '';
    phone: string;
    address: string;
    city: string;
    district: string;
    subdistrict: string;
    lingkungan: string;
    rayon: string;
    familyMembers: string; // To be deprecated or used as total
    familyMembersMale: string;
    familyMembersFemale: string;
    familyMembersOutside: string;
    familyMembersSidi: string;
    familyMembersSidiMale: string;
    familyMembersSidiFemale: string;
    familyMembersNonBaptized: string;
    familyMembersNonSidi: string;
    familyMembersNonSidiNames: string[];
    familyMembersNonBaptizedNames: string[];

    // Step 2: Diakonia
    diakonia_recipient: 'Ya' | 'Tidak' | '';
    diakonia_year: string;
    diakonia_type: string;

    // Step 2: Professional
    educationLevel: string;
    major: string;
    jobCategory: string; // KBJI
    jobTitle: string;
    companyName: string;
    yearsOfExperience: number;
    skills: string[];

    // Step 3: Commitment
    willingnessToServe: string; // Active / On-demand
    interestAreas: string[];
    contributionTypes: string[];
    professionalFamilyMembers: ProfessionalFamilyMember[];

    // Step 4: Education
    education_schoolingStatus: 'Ya' | 'Tidak' | 'Tidak ada anak usia sekolah';
    education_totalInSchool: number;
    education_inSchool_tk_paud: number;
    education_inSchool_sd: number;
    education_inSchool_smp: number;
    education_inSchool_sma: number;
    education_inSchool_university: number; // Added
    education_totalDropout: number; // Added
    education_dropout_tk_paud: number;
    education_dropout_sd: number;
    education_dropout_smp: number;
    education_dropout_sma: number;
    education_dropout_university: number; // Added
    education_totalUnemployed: number; // Added
    education_unemployed_sd: number;
    education_unemployed_smp: number;
    education_unemployed_sma: number;
    education_unemployed_university: number; // Added
    education_working: number;
    education_hasScholarship: 'Ya' | 'Tidak' | '';
    education_scholarshipType: string;
    education_scholarshipTypeOther: string;

    // Step 5: Economics
    economics_headOccupation: string;
    economics_headOccupationOther: string;
    economics_headIncomeRange: string;
    economics_headIncomeRangeDetailed?: string;
    economics_spouseOccupation: string;
    economics_spouseOccupationOther: string;
    economics_spouseIncomeRange: string;
    economics_spouseIncomeRangeDetailed?: string;
    economics_incomeRange: string;
    economics_incomeRangeDetailed?: string; // Optional detailed range if >= 5jt

    // Step 5: Household Expenses
    economics_expense_food: number;
    economics_expense_utilities: number;
    economics_expense_nonPanganII: number;
    economics_expense_loan: number;
    economics_expense_education: number;
    economics_expense_other: number;
    economics_expense_unexpected: number;
    economics_expense_worship: number;

    // Step 5: Business Ownership
    economics_hasBusiness: 'Ya' | 'Tidak' | '';
    economics_businessName: string;
    economics_businessType: string;
    economics_businessTypeOther: string;
    economics_businessDuration: string;
    economics_businessDurationYears: number;
    economics_businessStatus: string;
    economics_businessStatusOther: string;
    economics_businessLocation: string;
    economics_businessLocationOther: string;
    economics_businessEmployeeCount: string;
    economics_businessCapital: number;
    economics_businessCapitalSource: string;
    economics_businessCapitalSourceOther: string;
    economics_businessPermit: string[];
    economics_businessPermitOther: string;
    economics_businessTurnover: string;
    economics_businessTurnoverValue: number;
    economics_businessMarketing: string[];
    economics_businessMarketingOther: string;
    economics_businessMarketArea: string;
    economics_businessIssues: string;
    economics_businessIssuesOther: string;
    economics_businessNeeds: string;
    economics_businessNeedsOther: string;
    economics_businessSharing: 'Ya' | 'Tidak' | '';
    economics_businessTraining: string;
    economics_businessTrainingOther: string;

    // Step 5: Home & Asset Ownership
    economics_houseStatus: string;
    economics_houseType: string;
    economics_houseIMB: string;
    economics_hasAssets: 'Ya' | 'Tidak ada' | '';
    economics_totalAssets: number;
    economics_assets: string[];
    economics_asset_motor_qty: number;
    economics_asset_mobil_qty: number;
    economics_asset_kulkas_qty: number;
    economics_asset_laptop_qty: number;
    economics_asset_tv_qty: number;
    economics_asset_internet_qty: number;
    economics_asset_lahan_qty: number;
    economics_landStatus: string;
    economics_waterSource: string[];
    economics_electricity_capacities: string[];
    economics_electricity_450_qty: number;
    economics_electricity_900_qty: number;
    economics_electricity_1200_qty: number;
    economics_electricity_2200_qty: number;
    economics_electricity_5000_qty: number;
    economics_electricity_total_cost: number;

    // Step 6: Health
    health_sick30Days: string;
    health_chronicSick: string;
    health_chronicDisease: string[];
    health_chronicDiseaseOther: string;
    health_hasBPJS: string;
    health_bpjsNonParticipants: string;
    health_regularTreatment: string;
    health_hasBPJSKetenagakerjaan: string;
    health_socialAssistance: string;
    health_hasDisability: string;
    health_disabilityPhysical: string[];
    health_disabilityPhysicalOther: string;
    health_disabilityIntellectual: string[];
    health_disabilityIntellectualOther: string;
    health_disabilityMental: string[];
    health_disabilityMentalOther: string;
    health_disabilitySensory: string[];
    health_disabilitySensoryOther: string;
    health_disabilityDouble: boolean;

    // Step 7: Consent
    agreedToPrivacy: boolean;
    dataValidated: boolean;
}

export const initialFormData: FormData = {
    kkNumber: '',
    nik: '',
    fullName: '',
    gender: '',
    dateOfBirth: '',
    bloodType: '',
    maritalStatus: '',
    marriageDate: '',
    marriageType: [],
    baptismStatus: '',
    sidiStatus: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    subdistrict: '',
    lingkungan: '',
    rayon: '',
    familyMembers: '',
    familyMembersMale: '',
    familyMembersFemale: '',
    familyMembersOutside: '',
    familyMembersSidi: '',
    familyMembersSidiMale: '',
    familyMembersSidiFemale: '',
    familyMembersNonBaptized: '',
    familyMembersNonSidi: '',
    familyMembersNonSidiNames: [],
    familyMembersNonBaptizedNames: [],
    diakonia_recipient: '',
    diakonia_year: '',
    diakonia_type: '',
    educationLevel: '',
    major: '',
    jobCategory: '',
    jobTitle: '',
    companyName: '',
    yearsOfExperience: 0,
    skills: [],

    // Step 4: Education
    education_schoolingStatus: 'Tidak ada anak usia sekolah',
    education_totalInSchool: 0,
    education_inSchool_tk_paud: 0,
    education_inSchool_sd: 0,
    education_inSchool_smp: 0,
    education_inSchool_sma: 0,
    education_inSchool_university: 0,
    education_totalDropout: 0,
    education_dropout_tk_paud: 0,
    education_dropout_sd: 0,
    education_dropout_smp: 0,
    education_dropout_sma: 0,
    education_dropout_university: 0,
    education_totalUnemployed: 0,
    education_unemployed_sd: 0,
    education_unemployed_smp: 0,
    education_unemployed_sma: 0,
    education_unemployed_university: 0,
    education_working: 0,
    education_hasScholarship: '',
    education_scholarshipType: '',
    education_scholarshipTypeOther: '',

    // Step 5: Economics
    economics_headOccupation: '',
    economics_headOccupationOther: '',
    economics_headIncomeRange: '',
    economics_headIncomeRangeDetailed: '',
    economics_spouseOccupation: '',
    economics_spouseOccupationOther: '',
    economics_spouseIncomeRange: '',
    economics_spouseIncomeRangeDetailed: '',
    economics_incomeRange: '',
    economics_incomeRangeDetailed: '',

    // Step 5: Household Expenses
    economics_expense_food: 0,
    economics_expense_utilities: 0,
    economics_expense_nonPanganII: 0,
    economics_expense_loan: 0,
    economics_expense_education: 0,
    economics_expense_other: 0,
    economics_expense_unexpected: 0,
    economics_expense_worship: 0,

    // Step 5: Business Ownership
    economics_hasBusiness: '',
    economics_businessName: '',
    economics_businessType: '',
    economics_businessTypeOther: '',
    economics_businessDuration: '',
    economics_businessDurationYears: 0,
    economics_businessStatus: '',
    economics_businessStatusOther: '',
    economics_businessLocation: '',
    economics_businessLocationOther: '',
    economics_businessEmployeeCount: '',
    economics_businessCapital: 0,
    economics_businessCapitalSource: '',
    economics_businessCapitalSourceOther: '',
    economics_businessPermit: [],
    economics_businessPermitOther: '',
    economics_businessTurnover: '',
    economics_businessTurnoverValue: 0,
    economics_businessMarketing: [],
    economics_businessMarketingOther: '',
    economics_businessMarketArea: '',
    economics_businessIssues: '',
    economics_businessIssuesOther: '',
    economics_businessNeeds: '',
    economics_businessNeedsOther: '',
    economics_businessSharing: '',
    economics_businessTraining: '',
    economics_businessTrainingOther: '',

    // Step 5: Home & Asset Ownership
    economics_houseStatus: '',
    economics_houseType: '',
    economics_houseIMB: '',
    economics_hasAssets: '',
    economics_totalAssets: 0,
    economics_assets: [],
    economics_asset_motor_qty: 0,
    economics_asset_mobil_qty: 0,
    economics_asset_kulkas_qty: 0,
    economics_asset_laptop_qty: 0,
    economics_asset_tv_qty: 0,
    economics_asset_internet_qty: 0,
    economics_asset_lahan_qty: 0,
    economics_landStatus: '',
    economics_waterSource: [],
    economics_electricity_capacities: [],
    economics_electricity_450_qty: 0,
    economics_electricity_900_qty: 0,
    economics_electricity_1200_qty: 0,
    economics_electricity_2200_qty: 0,
    economics_electricity_5000_qty: 0,
    economics_electricity_total_cost: 0,

    // Step 6: Health
    health_sick30Days: '',
    health_chronicSick: '',
    health_chronicDisease: [],
    health_chronicDiseaseOther: '',
    health_hasBPJS: '',
    health_bpjsNonParticipants: '',
    health_regularTreatment: '',
    health_hasBPJSKetenagakerjaan: '',
    health_socialAssistance: '',
    health_hasDisability: '',
    health_disabilityPhysical: [],
    health_disabilityPhysicalOther: '',
    health_disabilityIntellectual: [],
    health_disabilityIntellectualOther: '',
    health_disabilityMental: [],
    health_disabilityMentalOther: '',
    health_disabilitySensory: [],
    health_disabilitySensoryOther: '',
    health_disabilityDouble: false,

    willingnessToServe: '',
    interestAreas: [],
    contributionTypes: [],
    professionalFamilyMembers: [],
    agreedToPrivacy: false,
    dataValidated: false,
};
