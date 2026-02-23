
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sdm_gmit'
};

async function migrateV7() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to database for V7 migration (Full 7-Step Support).");

        const commands = [
            "ALTER TABLE congregants ADD COLUMN kk_number VARCHAR(20) AFTER phone",
            "ALTER TABLE congregants ADD COLUMN nik VARCHAR(20) AFTER kk_number",

            "ALTER TABLE congregants ADD COLUMN family_members_male INT DEFAULT 0 AFTER nik",
            "ALTER TABLE congregants ADD COLUMN family_members_female INT DEFAULT 0 AFTER family_members_male",
            "ALTER TABLE congregants ADD COLUMN family_members_outside INT DEFAULT 0 AFTER family_members_female",
            "ALTER TABLE congregants ADD COLUMN family_members_sidi INT DEFAULT 0 AFTER family_members_outside",
            "ALTER TABLE congregants ADD COLUMN family_members_sidi_male INT DEFAULT 0 AFTER family_members_sidi",
            "ALTER TABLE congregants ADD COLUMN family_members_sidi_female INT DEFAULT 0 AFTER family_members_sidi_male",
            "ALTER TABLE congregants ADD COLUMN family_members_non_baptized INT DEFAULT 0 AFTER family_members_sidi_female",
            "ALTER TABLE congregants ADD COLUMN family_members_non_sidi INT DEFAULT 0 AFTER family_members_non_baptized",

            "ALTER TABLE congregants ADD COLUMN diakonia_recipient VARCHAR(10) AFTER family_members_non_sidi",
            "ALTER TABLE congregants ADD COLUMN diakonia_year VARCHAR(10) AFTER diakonia_recipient",
            "ALTER TABLE congregants ADD COLUMN diakonia_type TEXT AFTER diakonia_year",

            "ALTER TABLE congregants ADD COLUMN education_schooling_status VARCHAR(50) AFTER years_of_experience",
            "ALTER TABLE congregants ADD COLUMN education_in_school JSON AFTER education_schooling_status",
            "ALTER TABLE congregants ADD COLUMN education_dropout JSON AFTER education_in_school",
            "ALTER TABLE congregants ADD COLUMN education_unemployed JSON AFTER education_dropout",
            "ALTER TABLE congregants ADD COLUMN education_working INT DEFAULT 0 AFTER education_unemployed",

            "ALTER TABLE congregants ADD COLUMN economics_head_occupation VARCHAR(100) AFTER education_working",
            "ALTER TABLE congregants ADD COLUMN economics_spouse_occupation VARCHAR(100) AFTER economics_head_occupation",
            "ALTER TABLE congregants ADD COLUMN economics_income_range VARCHAR(50) AFTER economics_spouse_occupation",
            "ALTER TABLE congregants ADD COLUMN economics_income_range_detailed VARCHAR(50) AFTER economics_income_range",
            "ALTER TABLE congregants ADD COLUMN economics_expense JSON AFTER economics_income_range_detailed",

            "ALTER TABLE congregants ADD COLUMN economics_has_business VARCHAR(10) AFTER economics_expense",
            "ALTER TABLE congregants ADD COLUMN economics_business_data JSON AFTER economics_has_business",

            "ALTER TABLE congregants ADD COLUMN economics_house_status VARCHAR(50) AFTER economics_business_data",
            "ALTER TABLE congregants ADD COLUMN economics_house_type VARCHAR(50) AFTER economics_house_status",
            "ALTER TABLE congregants ADD COLUMN economics_house_imb VARCHAR(10) AFTER economics_house_type",
            "ALTER TABLE congregants ADD COLUMN economics_assets JSON AFTER economics_house_imb",
            "ALTER TABLE congregants ADD COLUMN economics_land_status VARCHAR(50) AFTER economics_assets",
            "ALTER TABLE congregants ADD COLUMN economics_water_source VARCHAR(50) AFTER economics_land_status",
            "ALTER TABLE congregants ADD COLUMN economics_electricity JSON AFTER economics_water_source",

            "ALTER TABLE congregants ADD COLUMN health_sick_30days VARCHAR(10) AFTER economics_electricity",
            "ALTER TABLE congregants ADD COLUMN health_chronic_sick VARCHAR(10) AFTER health_sick_30days",
            "ALTER TABLE congregants ADD COLUMN health_chronic_disease JSON AFTER health_chronic_sick",
            "ALTER TABLE congregants ADD COLUMN health_has_bpjs VARCHAR(10) AFTER health_chronic_disease",
            "ALTER TABLE congregants ADD COLUMN health_regular_treatment VARCHAR(10) AFTER health_has_bpjs",
            "ALTER TABLE congregants ADD COLUMN health_has_bpjs_ketenagakerjaan VARCHAR(10) AFTER health_regular_treatment",
            "ALTER TABLE congregants ADD COLUMN health_social_assistance VARCHAR(10) AFTER health_has_bpjs_ketenagakerjaan",
            "ALTER TABLE congregants ADD COLUMN health_disability_detail JSON AFTER health_social_assistance",

            "ALTER TABLE congregants ADD COLUMN professional_family_members JSON AFTER contribution_types"
        ];

        for (const cmd of commands) {
            try {
                console.log(`Executing: ${cmd}`);
                await connection.query(cmd);
                console.log("Success.");
            } catch (err: any) {
                if (err.code === 'ER_DUP_COLUMN_NAME') {
                    console.log("Column already exists.");
                } else {
                    console.error("Error:", err.message);
                }
            }
        }

        console.log("\nMigration completed successfully.");

    } catch (error: any) {
        console.error("Migration Failed:", error.message);
    } finally {
        if (connection) await connection.end();
    }
}

migrateV7();
