const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function run() {
    const conn = await mysql.createConnection(process.env.DATABASE_URL);
    try {
        const [cols] = await conn.query('SHOW COLUMNS FROM congregants');
        console.log('=== CONGREGANTS COLUMNS (' + cols.length + ') ===');
        const colNames = cols.map(c => c.Field);
        
        // Check critical columns used by dashboard stats
        const required = [
            'family_members', 'family_members_male', 'family_members_female', 'family_members_sidi',
            'gender', 'willingness_to_serve', 'education_level', 'skills', 'job_category',
            'lingkungan', 'rayon', 'diakonia_recipient', 'diakonia_type',
            'economics_assets', 'economics_business_type', 'economics_business_turnover',
            'economics_business_issues', 'economics_business_training', 'economics_business_needs',
            'economics_water_source',
            'health_disability_physical', 'health_disability_intellectual', 
            'health_disability_mental', 'health_disability_sensory',
            'health_chronic_disease', 'health_sick_30_days', 'health_regular_treatment',
            'professional_family_members',
            'education_in_school_tk_paud', 'education_in_school_sd', 'education_in_school_smp',
            'education_in_school_sma', 'education_in_school_university',
            'education_dropout_tk_paud', 'education_dropout_sd', 'education_dropout_smp',
            'education_dropout_sma', 'education_dropout_university',
            'education_unemployed_sd', 'education_unemployed_smp',
            'education_unemployed_sma', 'education_unemployed_university',
            'education_working'
        ];
        
        const missing = required.filter(r => !colNames.includes(r));
        if (missing.length > 0) {
            console.log('\n!!! MISSING COLUMNS (' + missing.length + '):');
            missing.forEach(m => console.log('  - ' + m));
        } else {
            console.log('\nAll required columns exist!');
        }
        
        // Now test actual queries
        console.log('\n=== TESTING QUERIES ===');
        await conn.query('SELECT count(*) as c FROM congregants');
        console.log('1. COUNT OK');
        await conn.query('SELECT SUM(family_members) as s FROM congregants');
        console.log('2. SUM family_members OK');
        await conn.query('SELECT gender, count(*) as c FROM congregants GROUP BY gender');
        console.log('3. Gender GROUP BY OK');
        await conn.query("SELECT count(*) as c FROM congregants WHERE job_category NOT IN ('Pelajar / Mahasiswa','Mengurus Rumah Tangga','Pensiunan','Belum Bekerja','-')");
        console.log('4. Professional NOT IN OK');
        await conn.query("SELECT diakonia_type, count(*) as c FROM congregants WHERE diakonia_recipient = 'Ya' GROUP BY diakonia_type");
        console.log('5. Diakonia OK');
        
        console.log('\n=== ALL QUERIES PASSED ===');
    } catch (err) {
        console.error('ERROR:', err.code, err.sqlMessage || err.message);
        if (err.sql) console.error('SQL:', err.sql.substring(0, 200));
    }
    await conn.end();
}

run();
