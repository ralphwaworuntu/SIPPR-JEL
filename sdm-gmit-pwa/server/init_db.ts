
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const dbName = 'sdm_gmit';

async function initDb() {
    console.log("Connecting to MySQL server...");
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3306
    });

    console.log(`Resetting database ${dbName}...`);
    await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\``);
    await connection.query(`CREATE DATABASE \`${dbName}\``);
    await connection.changeUser({ database: dbName });

    console.log("Creating congregants table with FULL schema...");
    const createTableQuery = `
    CREATE TABLE congregants (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        gender VARCHAR(20),
        date_of_birth DATE,
        phone VARCHAR(20),
        kk_number VARCHAR(20),
        nik VARCHAR(20),
        sector VARCHAR(50),
        lingkungan VARCHAR(50),
        rayon VARCHAR(50),
        address TEXT,
        family_members INT,
        family_members_male INT DEFAULT 0,
        family_members_female INT DEFAULT 0,
        family_members_outside INT DEFAULT 0,
        family_members_sidi INT DEFAULT 0,
        family_members_sidi_male INT DEFAULT 0,
        family_members_sidi_female INT DEFAULT 0,
        family_members_non_baptized INT DEFAULT 0,
        family_members_non_sidi INT DEFAULT 0,
        diakonia_recipient VARCHAR(10),
        diakonia_year VARCHAR(10),
        diakonia_type VARCHAR(100),
        education_level VARCHAR(50),
        major VARCHAR(100),
        job_category VARCHAR(100),
        job_title VARCHAR(100),
        company_name VARCHAR(150),
        years_of_experience INT DEFAULT 0,
        skills JSON,
        willingness_to_serve VARCHAR(50),
        interest_areas JSON,
        contribution_types JSON,
        professional_family_members JSON,
        education_schooling_status VARCHAR(50),
        education_in_school_tk_paud INT DEFAULT 0,
        education_in_school_sd INT DEFAULT 0,
        education_in_school_smp INT DEFAULT 0,
        education_in_school_sma INT DEFAULT 0,
        education_in_school_university INT DEFAULT 0,
        education_dropout_tk_paud INT DEFAULT 0,
        education_dropout_sd INT DEFAULT 0,
        education_dropout_smp INT DEFAULT 0,
        education_dropout_sma INT DEFAULT 0,
        education_dropout_university INT DEFAULT 0,
        education_unemployed_sd INT DEFAULT 0,
        education_unemployed_smp INT DEFAULT 0,
        education_unemployed_sma INT DEFAULT 0,
        education_unemployed_university INT DEFAULT 0,
        education_working INT DEFAULT 0,
        economics_head_occupation VARCHAR(100),
        economics_head_occupation_other VARCHAR(100),
        economics_spouse_occupation VARCHAR(100),
        economics_spouse_occupation_other VARCHAR(100),
        economics_income_range VARCHAR(50),
        economics_income_range_detailed VARCHAR(50),
        economics_expense_food INT DEFAULT 0,
        economics_expense_utilities INT DEFAULT 0,
        economics_expense_education INT DEFAULT 0,
        economics_expense_other INT DEFAULT 0,
        economics_has_business VARCHAR(10),
        economics_business_name VARCHAR(150),
        economics_business_type VARCHAR(100),
        economics_business_type_other VARCHAR(100),
        economics_business_duration VARCHAR(50),
        economics_business_duration_years INT,
        economics_business_status VARCHAR(50),
        economics_business_status_other VARCHAR(100),
        economics_business_location VARCHAR(100),
        economics_business_location_other VARCHAR(100),
        economics_business_employee_count VARCHAR(50),
        economics_business_capital INT,
        economics_business_capital_source VARCHAR(50),
        economics_business_capital_source_other VARCHAR(100),
        economics_business_permit JSON,
        economics_business_permit_other VARCHAR(100),
        economics_business_turnover VARCHAR(50),
        economics_business_turnover_value INT,
        economics_business_marketing JSON,
        economics_business_marketing_other VARCHAR(100),
        economics_business_market_area VARCHAR(100),
        economics_business_issues JSON,
        economics_business_issues_other VARCHAR(100),
        economics_business_needs JSON,
        economics_business_needs_other VARCHAR(100),
        economics_business_sharing VARCHAR(10),
        economics_business_training JSON,
        economics_business_training_other VARCHAR(100),
        economics_house_status VARCHAR(50),
        economics_house_type VARCHAR(50),
        economics_house_imb VARCHAR(50),
        economics_has_assets VARCHAR(20),
        economics_total_assets INT,
        economics_assets JSON,
        economics_asset_motor_qty INT DEFAULT 0,
        economics_asset_mobil_qty INT DEFAULT 0,
        economics_asset_kulkas_qty INT DEFAULT 0,
        economics_asset_laptop_qty INT DEFAULT 0,
        economics_asset_tv_qty INT DEFAULT 0,
        economics_asset_internet_qty INT DEFAULT 0,
        economics_asset_lahan_qty INT DEFAULT 0,
        economics_land_status VARCHAR(50),
        economics_water_source VARCHAR(50),
        economics_electricity_capacities JSON,
        economics_electricity_450_qty INT DEFAULT 0,
        economics_electricity_900_qty INT DEFAULT 0,
        economics_electricity_1200_qty INT DEFAULT 0,
        economics_electricity_2200_qty INT DEFAULT 0,
        economics_electricity_5000_qty INT DEFAULT 0,
        economics_electricity_total_cost INT DEFAULT 0,
        health_sick_30_days VARCHAR(10),
        health_chronic_sick VARCHAR(10),
        health_chronic_disease JSON,
        health_chronic_disease_other VARCHAR(100),
        health_has_bpjs VARCHAR(20),
        health_regular_treatment VARCHAR(10),
        health_has_bpjs_ketenagakerjaan VARCHAR(20),
        health_social_assistance VARCHAR(50),
        health_has_disability VARCHAR(10),
        health_disability_physical JSON,
        health_disability_physical_other VARCHAR(100),
        health_disability_intellectual JSON,
        health_disability_intellectual_other VARCHAR(100),
        health_disability_mental JSON,
        health_disability_mental_other VARCHAR(100),
        health_disability_sensory JSON,
        health_disability_sensory_other VARCHAR(100),
        health_disability_double BOOLEAN DEFAULT FALSE,
        latitude VARCHAR(50),
        longitude VARCHAR(50),
        status VARCHAR(20) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
    `;
    await connection.query(createTableQuery);

    console.log("Creating notifications table...");
    const createNotificationsQuery = `
    CREATE TABLE notifications (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(20) DEFAULT 'info',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;
    await connection.query(createNotificationsQuery);

    // Better Auth tables
    console.log("Creating Better Auth tables...");
    await connection.query(`
        CREATE TABLE user (
            id VARCHAR(36) PRIMARY KEY,
            name TEXT NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            emailVerified BOOLEAN NOT NULL,
            image TEXT,
            createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    `);

    await connection.query(`
        CREATE TABLE session (
            id VARCHAR(36) PRIMARY KEY,
            expiresAt TIMESTAMP NOT NULL,
            token VARCHAR(255) NOT NULL UNIQUE,
            createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            ipAddress TEXT,
            userAgent TEXT,
            userId VARCHAR(36) NOT NULL,
            FOREIGN KEY (userId) REFERENCES user(id)
        );
    `);

    await connection.query(`
        CREATE TABLE account (
            id VARCHAR(36) PRIMARY KEY,
            accountId TEXT NOT NULL,
            providerId TEXT NOT NULL,
            userId VARCHAR(36) NOT NULL,
            accessToken TEXT,
            refreshToken TEXT,
            idToken TEXT,
            accessTokenExpiresAt DATETIME,
            refreshTokenExpiresAt DATETIME,
            scope TEXT,
            password TEXT,
            createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES user(id)
        );
    `);

    await connection.query(`
        CREATE TABLE verification (
            id VARCHAR(36) PRIMARY KEY,
            identifier TEXT NOT NULL,
            value TEXT NOT NULL,
            expiresAt TIMESTAMP NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    `);

    console.log("Database reset and tables created successfully.");
    await connection.end();
}

initDb().catch((err) => {
    console.error("Failed to init DB:", err);
    process.exit(1);
});
