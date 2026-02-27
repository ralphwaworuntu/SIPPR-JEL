const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function run() {
    const conn = await mysql.createConnection(process.env.DATABASE_URL);
    try {
        // Check user table
        const [users] = await conn.query('SELECT id, name, email, role FROM user LIMIT 5');
        console.log('=== USERS ===');
        console.log(JSON.stringify(users, null, 2));
        
        // Check sessions
        const [sessions] = await conn.query('SELECT id, userId, token, expiresAt FROM session ORDER BY expiresAt DESC LIMIT 5');
        console.log('\n=== SESSIONS ===');
        sessions.forEach(s => {
            const expired = new Date(s.expiresAt) < new Date();
            console.log(`  ${s.id} | user=${s.userId} | expires=${s.expiresAt} | ${expired ? 'EXPIRED' : 'ACTIVE'}`);
        });

        // Check session table columns  
        const [sessionCols] = await conn.query('SHOW COLUMNS FROM session');
        console.log('\n=== SESSION COLUMNS ===');
        sessionCols.forEach(c => console.log(`  ${c.Field} (${c.Type})`));

        // Check user table columns
        const [userCols] = await conn.query('SHOW COLUMNS FROM user');
        console.log('\n=== USER COLUMNS ===');
        userCols.forEach(c => console.log(`  ${c.Field} (${c.Type})`));

    } catch (err) {
        console.error('ERROR:', err.code, err.sqlMessage || err.message);
    }
    await conn.end();
}

run();
