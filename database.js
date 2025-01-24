const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',    // The host of the MySQL server (localhost for XAMPP)
    user: 'root',         // MySQL username (default in XAMPP is 'root')
    password: '',         // MySQL password (default in XAMPP is empty)
    database: 'mynajmareservationdatabase', // Replace with your actual database name
    port: 3306            // Default MySQL port
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
});

module.exports = connection;
