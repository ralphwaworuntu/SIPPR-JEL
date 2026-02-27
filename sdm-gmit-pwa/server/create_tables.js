const m = require('mysql2/promise');
require('dotenv').config();

(async () => {
    const c = await m.createConnection(process.env.DATABASE_URL);

    const queries = [
        `CREATE TABLE IF NOT EXISTS enumerators (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            rayon VARCHAR(50) NOT NULL,
            lingkungan VARCHAR(50) NOT NULL,
            family_count INT DEFAULT 0,
            whatsapp VARCHAR(20),
            login_email VARCHAR(255),
            login_password VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS pendamping (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            lingkungan VARCHAR(50) NOT NULL,
            family_count INT DEFAULT 0,
            enumerator_count INT DEFAULT 0,
            whatsapp VARCHAR(20),
            login_email VARCHAR(255),
            login_password VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS visits (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            enumerator_id BIGINT UNSIGNED NOT NULL,
            congregant_id BIGINT UNSIGNED NOT NULL,
            congregant_name VARCHAR(255) NOT NULL,
            photo_url VARCHAR(500),
            notes TEXT,
            status VARCHAR(20) DEFAULT 'pending',
            rejection_reason TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS notifications (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type VARCHAR(20) DEFAULT 'info',
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    for (const sql of queries) {
        const tableName = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/)[1];
        await c.query(sql);
        console.log('Created table:', tableName);
    }

    await c.end();
    console.log('\nAll tables created successfully!');
})();
