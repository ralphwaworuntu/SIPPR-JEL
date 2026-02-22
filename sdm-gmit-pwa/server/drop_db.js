const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

async function run() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3306
    });
    await connection.query("DROP DATABASE IF EXISTS sdm_gmit;");
    await connection.query("CREATE DATABASE sdm_gmit;");
    console.log("Database dropped and recreated!");
    await connection.end();
}
run();
