import { db } from './db';
import { sql } from 'drizzle-orm';

async function migrate_v11_nuke() {
    try {
        console.log("Migrating database (v11) - NUCLEAR OPTION: DROP AND RECREATE...");

        // 1. Drop existing table
        console.log("1. Dropping existing congregants table...");
        try {
            await db.execute(sql`DROP TABLE IF EXISTS congregants;`);
            console.log("  ✅ Table dropped.");
        } catch (e: any) {
            console.error("  ❌ Drop failed:", e.message);
        }

        // 2. Recreate with updated schema and DYNAMIC format
        console.log("\n2. Recreating congregants table with optimized types and DYNAMIC format...");
        const createTableQuery = `
CREATE TABLE \`congregants\` (
  \`id\` serial PRIMARY KEY,
  \`full_name\` varchar(255) NOT NULL,
  \`gender\` varchar(20),
  \`date_of_birth\` date,
  \`phone\` varchar(20),
  \`kk_number\` varchar(20),
  \`nik\` varchar(20),
  \`blood_type\` varchar(10),
  \`marital_status\` varchar(50),
  \`marriage_date\` date,
  \`marriage_type\` json,
  \`baptism_status\` varchar(50),
  \`sidi_status\` varchar(50),
  \`lingkungan\` varchar(50),
  \`rayon\` varchar(50),
  \`address\` text,
  \`city\` varchar(100),
  \`district\` varchar(100),
  \`subdistrict\` varchar(100),
  \`family_members\` int,
  \`family_members_male\` int,
  \`family_members_female\` int,
  \`family_members_outside\` int,
  \`family_members_sidi\` int,
  \`family_members_sidi_male\` int,
  \`family_members_sidi_female\` int,
  \`family_members_non_baptized\` int,
  \`family_members_non_sidi\` int,
  \`family_members_non_sidi_names\` json,
  \`family_members_non_baptized_names\` json,
  \`has_non_sidi_adult_18\` varchar(10),
  \`diakonia_recipient\` varchar(10),
  \`diakonia_year\` varchar(10),
  \`diakonia_type\` varchar(100),
  \`education_level\` varchar(50),
  \`major\` text,
  \`job_category\` text,
  \`job_title\` text,
  \`company_name\` text,
  \`years_of_experience\` int DEFAULT 0,
  \`skills\` json,
  \`willingness_to_serve\` varchar(50),
  \`interest_areas\` json,
  \`contribution_types\` json,
  \`professional_family_members\` json,
  \`education_schooling_status\` varchar(50),
  \`education_total_in_school\` int DEFAULT 0,
  \`education_in_school_tk_paud\` int DEFAULT 0,
  \`education_in_school_sd\` int DEFAULT 0,
  \`education_in_school_smp\` int DEFAULT 0,
  \`education_in_school_sma\` int DEFAULT 0,
  \`education_in_school_university\` int DEFAULT 0,
  \`education_total_dropout\` int DEFAULT 0,
  \`education_dropout_tk_paud\` int DEFAULT 0,
  \`education_dropout_sd\` int DEFAULT 0,
  \`education_dropout_smp\` int DEFAULT 0,
  \`education_dropout_sma\` int DEFAULT 0,
  \`education_dropout_university\` int DEFAULT 0,
  \`education_total_unemployed\` int DEFAULT 0,
  \`education_unemployed_sd\` int DEFAULT 0,
  \`education_unemployed_smp\` int DEFAULT 0,
  \`education_unemployed_sma\` int DEFAULT 0,
  \`education_unemployed_university\` int DEFAULT 0,
  \`education_working\` int DEFAULT 0,
  \`education_has_scholarship\` varchar(10),
  \`education_scholarship_type\` varchar(100),
  \`education_scholarship_type_other\` varchar(100),
  \`economics_head_occupation\` varchar(100),
  \`economics_head_occupation_other\` varchar(100),
  \`economics_head_income_range\` varchar(50),
  \`economics_head_income_range_detailed\` varchar(50),
  \`economics_spouse_occupation\` varchar(100),
  \`economics_spouse_occupation_other\` varchar(100),
  \`economics_spouse_income_range\` varchar(50),
  \`economics_spouse_income_range_detailed\` varchar(50),
  \`economics_income_range\` varchar(50),
  \`economics_income_range_detailed\` varchar(50),
  \`economics_expense_food\` int DEFAULT 0,
  \`economics_expense_utilities\` int DEFAULT 0,
  \`economics_expense_non_pangan_ii\` int DEFAULT 0,
  \`economics_expense_loan\` int DEFAULT 0,
  \`economics_expense_education\` int DEFAULT 0,
  \`economics_expense_other\` int DEFAULT 0,
  \`economics_expense_unexpected\` int DEFAULT 0,
  \`economics_expense_worship\` int DEFAULT 0,
  \`economics_has_business\` varchar(10),
  \`economics_business_name\` text,
  \`economics_business_type\` text,
  \`economics_business_type_other\` text,
  \`economics_business_duration\` varchar(50),
  \`economics_business_duration_years\` int,
  \`economics_business_status\` varchar(50),
  \`economics_business_status_other\` text,
  \`economics_business_location\` text,
  \`economics_business_location_other\` text,
  \`economics_business_employee_count\` varchar(50),
  \`economics_business_capital\` int,
  \`economics_business_capital_source\` varchar(50),
  \`economics_business_capital_source_other\` text,
  \`economics_business_permit\` json,
  \`economics_business_permit_other\` text,
  \`economics_business_turnover\` varchar(50),
  \`economics_business_turnover_value\` int,
  \`economics_business_marketing\` json,
  \`economics_business_marketing_other\` text,
  \`economics_business_market_area\` text,
  \`economics_business_issues\` text,
  \`economics_business_issues_other\` text,
  \`economics_business_needs\` text,
  \`economics_business_needs_other\` text,
  \`economics_business_sharing\` varchar(10),
  \`economics_business_training\` text,
  \`economics_business_training_other\` text,
  \`economics_house_status\` varchar(50),
  \`economics_house_type\` varchar(50),
  \`economics_house_imb\` varchar(50),
  \`economics_has_assets\` varchar(20),
  \`economics_total_assets\` int,
  \`economics_assets\` json,
  \`economics_asset_motor_qty\` int DEFAULT 0,
  \`economics_asset_mobil_qty\` int DEFAULT 0,
  \`economics_asset_kulkas_qty\` int DEFAULT 0,
  \`economics_asset_laptop_qty\` int DEFAULT 0,
  \`economics_asset_tv_qty\` int DEFAULT 0,
  \`economics_asset_internet_qty\` int DEFAULT 0,
  \`economics_asset_lahan_qty\` int DEFAULT 0,
  \`economics_land_status\` varchar(50),
  \`economics_water_source\` json,
  \`economics_electricity_capacities\` json,
  \`economics_electricity_450_qty\` int DEFAULT 0,
  \`economics_electricity_900_qty\` int DEFAULT 0,
  \`economics_electricity_1200_qty\` int DEFAULT 0,
  \`economics_electricity_2200_qty\` int DEFAULT 0,
  \`economics_electricity_5000_qty\` int DEFAULT 0,
  \`economics_electricity_total_cost\` int DEFAULT 0,
  \`health_sick_30_days\` varchar(10),
  \`health_chronic_sick\` varchar(10),
  \`health_chronic_disease\` json,
  \`health_chronic_disease_other\` varchar(100),
  \`health_has_bpjs\` varchar(20),
  \`health_bpjs_non_participants\` text,
  \`health_regular_treatment\` varchar(10),
  \`health_has_bpjs_ketenagakerjaan\` varchar(20),
  \`health_social_assistance\` varchar(50),
  \`health_has_disability\` varchar(10),
  \`health_disability_physical\` json,
  \`health_disability_physical_other\` varchar(100),
  \`health_disability_intellectual\` json,
  \`health_disability_intellectual_other\` varchar(100),
  \`health_disability_mental\` json,
  \`health_disability_mental_other\` varchar(100),
  \`health_disability_sensory\` json,
  \`health_disability_sensory_other\` varchar(100),
  \`health_disability_double\` boolean DEFAULT false,
  \`status\` varchar(20) DEFAULT 'PENDING',
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ROW_FORMAT=DYNAMIC;
        `;

        try {
            await db.execute(sql.raw(createTableQuery));
            console.log("  ✅ Table recreated with DYNAMIC format.");
        } catch (e: any) {
            console.error("  ❌ Recreate failed:", e.message);
        }

        console.log("\nMigration completed.");
        process.exit(0);
    } catch (error) {
        console.error("Fatal:", error);
        process.exit(1);
    }
}

migrate_v11_nuke();
