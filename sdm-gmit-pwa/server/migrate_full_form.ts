import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sdm_gmit'
};

async function migrateFullForm() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to database for full-form migration.");

        const commands = [
            // Step 1: Identity extras
            "ALTER TABLE congregants ADD COLUMN kk_number VARCHAR(20)",
            "ALTER TABLE congregants ADD COLUMN nik VARCHAR(20)",
            "ALTER TABLE congregants ADD COLUMN family_members INT",
            "ALTER TABLE congregants ADD COLUMN family_members_male INT",
            "ALTER TABLE congregants ADD COLUMN family_members_female INT",
            "ALTER TABLE congregants ADD COLUMN family_members_outside INT",
            "ALTER TABLE congregants ADD COLUMN family_members_sidi INT",
            "ALTER TABLE congregants ADD COLUMN family_members_sidi_male INT",
            "ALTER TABLE congregants ADD COLUMN family_members_sidi_female INT",
            "ALTER TABLE congregants ADD COLUMN family_members_non_baptized INT",
            "ALTER TABLE congregants ADD COLUMN family_members_non_sidi INT",

            // Step 2: Diakonia
            "ALTER TABLE congregants ADD COLUMN diakonia_recipient VARCHAR(10)",
            "ALTER TABLE congregants ADD COLUMN diakonia_year VARCHAR(10)",
            "ALTER TABLE congregants ADD COLUMN diakonia_type VARCHAR(100)",

            // Step 3: Professional Family Members
            "ALTER TABLE congregants ADD COLUMN professional_family_members JSON",

            // Step 4: Education (Children)
            "ALTER TABLE congregants ADD COLUMN education_schooling_status VARCHAR(50)",
            "ALTER TABLE congregants ADD COLUMN education_in_school_tk_paud INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN education_in_school_sd INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN education_in_school_smp INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN education_in_school_sma INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN education_in_school_university INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN education_dropout_tk_paud INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN education_dropout_sd INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN education_dropout_smp INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN education_dropout_sma INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN education_dropout_university INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN education_unemployed_sd INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN education_unemployed_smp INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN education_unemployed_sma INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN education_unemployed_university INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN education_working INT DEFAULT 0",

            // Step 5: Economics — Occupation & Income
            "ALTER TABLE congregants ADD COLUMN economics_head_occupation VARCHAR(100)",
            "ALTER TABLE congregants ADD COLUMN economics_head_occupation_other VARCHAR(100)",
            "ALTER TABLE congregants ADD COLUMN economics_spouse_occupation VARCHAR(100)",
            "ALTER TABLE congregants ADD COLUMN economics_spouse_occupation_other VARCHAR(100)",
            "ALTER TABLE congregants ADD COLUMN economics_income_range VARCHAR(50)",
            "ALTER TABLE congregants ADD COLUMN economics_income_range_detailed VARCHAR(50)",

            // Step 5: Expenses
            "ALTER TABLE congregants ADD COLUMN economics_expense_food INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN economics_expense_utilities INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN economics_expense_education INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN economics_expense_other INT DEFAULT 0",

            // Step 5: Business
            "ALTER TABLE congregants ADD COLUMN economics_has_business VARCHAR(10)",
            "ALTER TABLE congregants ADD COLUMN economics_business_name VARCHAR(150)",
            "ALTER TABLE congregants ADD COLUMN economics_business_type VARCHAR(100)",
            "ALTER TABLE congregants ADD COLUMN economics_business_type_other VARCHAR(100)",
            "ALTER TABLE congregants ADD COLUMN economics_business_duration VARCHAR(50)",
            "ALTER TABLE congregants ADD COLUMN economics_business_duration_years INT",
            "ALTER TABLE congregants ADD COLUMN economics_business_status VARCHAR(50)",
            "ALTER TABLE congregants ADD COLUMN economics_business_status_other VARCHAR(100)",
            "ALTER TABLE congregants ADD COLUMN economics_business_location VARCHAR(100)",
            "ALTER TABLE congregants ADD COLUMN economics_business_location_other VARCHAR(100)",
            "ALTER TABLE congregants ADD COLUMN economics_business_employee_count VARCHAR(50)",
            "ALTER TABLE congregants ADD COLUMN economics_business_capital INT",
            "ALTER TABLE congregants ADD COLUMN economics_business_capital_source VARCHAR(50)",
            "ALTER TABLE congregants ADD COLUMN economics_business_capital_source_other VARCHAR(100)",
            "ALTER TABLE congregants ADD COLUMN economics_business_permit JSON",
            "ALTER TABLE congregants ADD COLUMN economics_business_permit_other VARCHAR(100)",
            "ALTER TABLE congregants ADD COLUMN economics_business_turnover VARCHAR(50)",
            "ALTER TABLE congregants ADD COLUMN economics_business_turnover_value INT",
            "ALTER TABLE congregants ADD COLUMN economics_business_marketing JSON",
            "ALTER TABLE congregants ADD COLUMN economics_business_marketing_other VARCHAR(100)",
            "ALTER TABLE congregants ADD COLUMN economics_business_market_area VARCHAR(100)",
            "ALTER TABLE congregants ADD COLUMN economics_business_issues JSON",
            "ALTER TABLE congregants ADD COLUMN economics_business_issues_other VARCHAR(100)",
            "ALTER TABLE congregants ADD COLUMN economics_business_needs JSON",
            "ALTER TABLE congregants ADD COLUMN economics_business_needs_other VARCHAR(100)",
            "ALTER TABLE congregants ADD COLUMN economics_business_sharing VARCHAR(10)",
            "ALTER TABLE congregants ADD COLUMN economics_business_training JSON",
            "ALTER TABLE congregants ADD COLUMN economics_business_training_other VARCHAR(100)",

            // Step 5: Home & Assets
            "ALTER TABLE congregants ADD COLUMN economics_house_status VARCHAR(50)",
            "ALTER TABLE congregants ADD COLUMN economics_house_type VARCHAR(50)",
            "ALTER TABLE congregants ADD COLUMN economics_house_imb VARCHAR(50)",
            "ALTER TABLE congregants ADD COLUMN economics_has_assets VARCHAR(20)",
            "ALTER TABLE congregants ADD COLUMN economics_total_assets INT",
            "ALTER TABLE congregants ADD COLUMN economics_assets JSON",
            "ALTER TABLE congregants ADD COLUMN economics_asset_motor_qty INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN economics_asset_mobil_qty INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN economics_asset_kulkas_qty INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN economics_asset_laptop_qty INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN economics_asset_tv_qty INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN economics_asset_internet_qty INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN economics_asset_lahan_qty INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN economics_land_status VARCHAR(50)",
            "ALTER TABLE congregants ADD COLUMN economics_water_source VARCHAR(50)",
            "ALTER TABLE congregants ADD COLUMN economics_electricity_capacities JSON",
            "ALTER TABLE congregants ADD COLUMN economics_electricity_450_qty INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN economics_electricity_900_qty INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN economics_electricity_1200_qty INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN economics_electricity_2200_qty INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN economics_electricity_5000_qty INT DEFAULT 0",
            "ALTER TABLE congregants ADD COLUMN economics_electricity_total_cost INT DEFAULT 0",

            // Step 6: Health
            "ALTER TABLE congregants ADD COLUMN health_sick_30_days VARCHAR(10)",
            "ALTER TABLE congregants ADD COLUMN health_chronic_sick VARCHAR(10)",
            "ALTER TABLE congregants ADD COLUMN health_chronic_disease JSON",
            "ALTER TABLE congregants ADD COLUMN health_chronic_disease_other VARCHAR(100)",
            "ALTER TABLE congregants ADD COLUMN health_has_bpjs VARCHAR(20)",
            "ALTER TABLE congregants ADD COLUMN health_regular_treatment VARCHAR(10)",
            "ALTER TABLE congregants ADD COLUMN health_has_bpjs_ketenagakerjaan VARCHAR(20)",
            "ALTER TABLE congregants ADD COLUMN health_social_assistance VARCHAR(50)",
            "ALTER TABLE congregants ADD COLUMN health_has_disability VARCHAR(10)",
            "ALTER TABLE congregants ADD COLUMN health_disability_physical JSON",
            "ALTER TABLE congregants ADD COLUMN health_disability_physical_other VARCHAR(100)",
            "ALTER TABLE congregants ADD COLUMN health_disability_intellectual JSON",
            "ALTER TABLE congregants ADD COLUMN health_disability_intellectual_other VARCHAR(100)",
            "ALTER TABLE congregants ADD COLUMN health_disability_mental JSON",
            "ALTER TABLE congregants ADD COLUMN health_disability_mental_other VARCHAR(100)",
            "ALTER TABLE congregants ADD COLUMN health_disability_sensory JSON",
            "ALTER TABLE congregants ADD COLUMN health_disability_sensory_other VARCHAR(100)",
            "ALTER TABLE congregants ADD COLUMN health_disability_double BOOLEAN DEFAULT FALSE",
        ];

        let success = 0;
        let skipped = 0;
        let failed = 0;

        for (const cmd of commands) {
            try {
                await connection.query(cmd);
                success++;
                // Extract column name from command
                const match = cmd.match(/ADD COLUMN (\S+)/);
                if (match) console.log(`  ✅ Added: ${match[1]}`);
            } catch (err: any) {
                if (err.code === 'ER_DUP_COLUMN_NAME' || err.message.includes('Duplicate column name')) {
                    skipped++;
                } else {
                    failed++;
                    console.error(`  ❌ FAILED: ${cmd}`);
                    console.error(`     Error: ${err.message}`);
                }
            }
        }

        console.log(`\n--- Migration Summary ---`);
        console.log(`Total commands: ${commands.length}`);
        console.log(`Added: ${success}`);
        console.log(`Already existed (skipped): ${skipped}`);
        console.log(`Failed: ${failed}`);

        // Verify
        console.log(`\n--- Column Count ---`);
        const [columns]: any = await connection.query("SELECT COUNT(*) as cnt FROM information_schema.columns WHERE table_name = 'congregants' AND table_schema = 'sdm_gmit'");
        console.log(`Total columns in congregants: ${columns[0].cnt}`);

    } catch (error: any) {
        console.error("Fatal Migration Error:", error.message);
    } finally {
        if (connection) await connection.end();
    }
}

migrateFullForm();
