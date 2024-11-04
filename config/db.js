const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Moseh1209#',
    database: 'telemed',
    port: 3306,
    connectionLimit: 10, 
    waitForConnections: true,
    queueLimit: 0 
});

// Check the connection
async function checkConnection() {
    try {
        const connection = await db.getConnection();
        console.log('MySQL Connected!');
        connection.release(); 
    } catch (error) {
        console.error('Error connecting to MySQL:', error);
    }
}

checkConnection();

module.exports = db; 
