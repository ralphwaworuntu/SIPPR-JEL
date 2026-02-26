import { mysqlTable, serial, bigint, varchar, date, text, timestamp, boolean, json, int, datetime } from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: text("name").notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("emailVerified").notNull(),
    image: text("image"),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull()
});

export const session = mysqlTable("session", {
    id: varchar("id", { length: 36 }).primaryKey(),
    expiresAt: timestamp('expiresAt').defaultNow().notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: varchar("userId", { length: 36 }).notNull().references(() => user.id)
});

export const account = mysqlTable("account", {
    id: varchar("id", { length: 36 }).primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: varchar("userId", { length: 36 }).notNull().references(() => user.id),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: datetime("accessTokenExpiresAt", { mode: 'date' }),
    refreshTokenExpiresAt: datetime("refreshTokenExpiresAt", { mode: 'date' }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull()
});

export const verification = mysqlTable("verification", {
    id: varchar("id", { length: 36 }).primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp('expiresAt').defaultNow().notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow()
});

export const congregants = mysqlTable("congregants", {
    id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    gender: varchar("gender", { length: 20 }), // Laki-laki / Perempuan
    dateOfBirth: date("date_of_birth"),
    phone: varchar("phone", { length: 20 }),

    // Step 1: Identity — New fields
    kkNumber: varchar("kk_number", { length: 20 }),
    nik: varchar("nik", { length: 20 }),

    // Church Details
    lingkungan: varchar("lingkungan", { length: 50 }),
    rayon: varchar("rayon", { length: 50 }),

    address: text("address"),

    // Step 1: Family Members
    familyMembers: int("family_members"),
    familyMembersMale: int("family_members_male"),
    familyMembersFemale: int("family_members_female"),
    familyMembersOutside: int("family_members_outside"),
    familyMembersSidi: int("family_members_sidi"),
    familyMembersSidiMale: int("family_members_sidi_male"),
    familyMembersSidiFemale: int("family_members_sidi_female"),
    familyMembersNonBaptized: int("family_members_non_baptized"),
    familyMembersNonSidi: int("family_members_non_sidi"),
    familyMembersNonSidiNames: json("family_members_non_sidi_names"), // string[]
    familyMembersNonBaptizedNames: json("family_members_non_baptized_names"), // string[]

    // Step 2: Diakonia
    diakoniaRecipient: varchar("diakonia_recipient", { length: 10 }),
    diakoniaYear: varchar("diakonia_year", { length: 10 }),
    diakoniaType: varchar("diakonia_type", { length: 100 }),

    // Professional
    educationLevel: varchar("education_level", { length: 50 }),
    major: varchar("major", { length: 100 }),
    jobCategory: varchar("job_category", { length: 100 }),
    jobTitle: varchar("job_title", { length: 100 }),
    companyName: varchar("company_name", { length: 150 }),
    yearsOfExperience: int("years_of_experience").default(0),

    // Skills
    skills: json("skills"), // string[]

    // Commitment
    willingnessToServe: varchar("willingness_to_serve", { length: 50 }), // Aktif, On-demand, Not-available
    interestAreas: json("interest_areas"), // string[]
    contributionTypes: json("contribution_types"), // string[]

    // Step 3: Professional Family Members
    professionalFamilyMembers: json("professional_family_members"), // ProfessionalFamilyMember[]

    // Step 4: Education (Children)
    educationSchoolingStatus: varchar("education_schooling_status", { length: 50 }),
    educationInSchoolTkPaud: int("education_in_school_tk_paud").default(0),
    educationInSchoolSd: int("education_in_school_sd").default(0),
    educationInSchoolSmp: int("education_in_school_smp").default(0),
    educationInSchoolSma: int("education_in_school_sma").default(0),
    educationInSchoolUniversity: int("education_in_school_university").default(0),
    educationDropoutTkPaud: int("education_dropout_tk_paud").default(0),
    educationDropoutSd: int("education_dropout_sd").default(0),
    educationDropoutSmp: int("education_dropout_smp").default(0),
    educationDropoutSma: int("education_dropout_sma").default(0),
    educationDropoutUniversity: int("education_dropout_university").default(0),
    educationUnemployedSd: int("education_unemployed_sd").default(0),
    educationUnemployedSmp: int("education_unemployed_smp").default(0),
    educationUnemployedSma: int("education_unemployed_sma").default(0),
    educationUnemployedUniversity: int("education_unemployed_university").default(0),
    educationWorking: int("education_working").default(0),

    // Step 5: Economics — Occupation & Income
    economicsHeadOccupation: varchar("economics_head_occupation", { length: 100 }),
    economicsHeadOccupationOther: varchar("economics_head_occupation_other", { length: 100 }),
    economicsHeadIncomeRange: varchar("economics_head_income_range", { length: 50 }),
    economicsHeadIncomeRangeDetailed: varchar("economics_head_income_range_detailed", { length: 50 }),
    economicsSpouseOccupation: varchar("economics_spouse_occupation", { length: 100 }),
    economicsSpouseOccupationOther: varchar("economics_spouse_occupation_other", { length: 100 }),
    economicsSpouseIncomeRange: varchar("economics_spouse_income_range", { length: 50 }),
    economicsSpouseIncomeRangeDetailed: varchar("economics_spouse_income_range_detailed", { length: 50 }),
    economicsIncomeRange: varchar("economics_income_range", { length: 50 }),
    economicsIncomeRangeDetailed: varchar("economics_income_range_detailed", { length: 50 }),

    // Step 5: Household Expenses
    economicsExpenseFood: int("economics_expense_food").default(0),
    economicsExpenseUtilities: int("economics_expense_utilities").default(0),
    economicsExpenseEducation: int("economics_expense_education").default(0),
    economicsExpenseOther: int("economics_expense_other").default(0),

    // Step 5: Business Ownership
    economicsHasBusiness: varchar("economics_has_business", { length: 10 }),
    economicsBusinessName: varchar("economics_business_name", { length: 150 }),
    economicsBusinessType: varchar("economics_business_type", { length: 100 }),
    economicsBusinessTypeOther: varchar("economics_business_type_other", { length: 100 }),
    economicsBusinessDuration: varchar("economics_business_duration", { length: 50 }),
    economicsBusinessDurationYears: int("economics_business_duration_years"),
    economicsBusinessStatus: varchar("economics_business_status", { length: 50 }),
    economicsBusinessStatusOther: varchar("economics_business_status_other", { length: 100 }),
    economicsBusinessLocation: varchar("economics_business_location", { length: 100 }),
    economicsBusinessLocationOther: varchar("economics_business_location_other", { length: 100 }),
    economicsBusinessEmployeeCount: varchar("economics_business_employee_count", { length: 50 }),
    economicsBusinessCapital: int("economics_business_capital"),
    economicsBusinessCapitalSource: varchar("economics_business_capital_source", { length: 50 }),
    economicsBusinessCapitalSourceOther: varchar("economics_business_capital_source_other", { length: 100 }),
    economicsBusinessPermit: json("economics_business_permit"), // string[]
    economicsBusinessPermitOther: varchar("economics_business_permit_other", { length: 100 }),
    economicsBusinessTurnover: varchar("economics_business_turnover", { length: 50 }),
    economicsBusinessTurnoverValue: int("economics_business_turnover_value"),
    economicsBusinessMarketing: json("economics_business_marketing"), // string[]
    economicsBusinessMarketingOther: varchar("economics_business_marketing_other", { length: 100 }),
    economicsBusinessMarketArea: varchar("economics_business_market_area", { length: 100 }),
    economicsBusinessIssues: varchar("economics_business_issues", { length: 255 }),
    economicsBusinessIssuesOther: varchar("economics_business_issues_other", { length: 100 }),
    economicsBusinessNeeds: varchar("economics_business_needs", { length: 255 }),
    economicsBusinessNeedsOther: varchar("economics_business_needs_other", { length: 100 }),
    economicsBusinessSharing: varchar("economics_business_sharing", { length: 10 }),
    economicsBusinessTraining: varchar("economics_business_training", { length: 255 }),
    economicsBusinessTrainingOther: varchar("economics_business_training_other", { length: 100 }),

    // Step 5: Home & Assets
    economicsHouseStatus: varchar("economics_house_status", { length: 50 }),
    economicsHouseType: varchar("economics_house_type", { length: 50 }),
    economicsHouseIMB: varchar("economics_house_imb", { length: 50 }),
    economicsHasAssets: varchar("economics_has_assets", { length: 20 }),
    economicsTotalAssets: int("economics_total_assets"),
    economicsAssets: json("economics_assets"), // string[]
    economicsAssetMotorQty: int("economics_asset_motor_qty").default(0),
    economicsAssetMobilQty: int("economics_asset_mobil_qty").default(0),
    economicsAssetKulkasQty: int("economics_asset_kulkas_qty").default(0),
    economicsAssetLaptopQty: int("economics_asset_laptop_qty").default(0),
    economicsAssetTvQty: int("economics_asset_tv_qty").default(0),
    economicsAssetInternetQty: int("economics_asset_internet_qty").default(0),
    economicsAssetLahanQty: int("economics_asset_lahan_qty").default(0),
    economicsLandStatus: varchar("economics_land_status", { length: 50 }),
    economicsWaterSource: json("economics_water_source"),
    economicsElectricityCapacities: json("economics_electricity_capacities"), // string[]
    economicsElectricity450Qty: int("economics_electricity_450_qty").default(0),
    economicsElectricity900Qty: int("economics_electricity_900_qty").default(0),
    economicsElectricity1200Qty: int("economics_electricity_1200_qty").default(0),
    economicsElectricity2200Qty: int("economics_electricity_2200_qty").default(0),
    economicsElectricity5000Qty: int("economics_electricity_5000_qty").default(0),
    economicsElectricityTotalCost: int("economics_electricity_total_cost").default(0),

    // Step 6: Health
    healthSick30Days: varchar("health_sick_30_days", { length: 10 }),
    healthChronicSick: varchar("health_chronic_sick", { length: 10 }),
    healthChronicDisease: json("health_chronic_disease"), // string[]
    healthChronicDiseaseOther: varchar("health_chronic_disease_other", { length: 100 }),
    healthHasBPJS: varchar("health_has_bpjs", { length: 20 }),
    healthRegularTreatment: varchar("health_regular_treatment", { length: 10 }),
    healthHasBPJSKetenagakerjaan: varchar("health_has_bpjs_ketenagakerjaan", { length: 20 }),
    healthSocialAssistance: varchar("health_social_assistance", { length: 50 }),
    healthHasDisability: varchar("health_has_disability", { length: 10 }),
    healthDisabilityPhysical: json("health_disability_physical"), // string[]
    healthDisabilityPhysicalOther: varchar("health_disability_physical_other", { length: 100 }),
    healthDisabilityIntellectual: json("health_disability_intellectual"), // string[]
    healthDisabilityIntellectualOther: varchar("health_disability_intellectual_other", { length: 100 }),
    healthDisabilityMental: json("health_disability_mental"), // string[]
    healthDisabilityMentalOther: varchar("health_disability_mental_other", { length: 100 }),
    healthDisabilitySensory: json("health_disability_sensory"), // string[]
    healthDisabilitySensoryOther: varchar("health_disability_sensory_other", { length: 100 }),
    healthDisabilityDouble: boolean("health_disability_double").default(false),

    // Geolocation
    latitude: varchar("latitude", { length: 50 }),
    longitude: varchar("longitude", { length: 50 }),

    status: varchar("status", { length: 20 }).default('PENDING'), // PENDING, VALIDATED

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const notifications = mysqlTable("notifications", {
    id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    type: varchar("type", { length: 20 }).default('info'), // info, warning, success
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at").defaultNow()
});
