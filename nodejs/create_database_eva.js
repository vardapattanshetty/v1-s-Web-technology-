// create_database.js
const mysql = require('mysql');

// Create a connection to MySQL (change the host, user, and password accordingly)
const connection = mysql.createConnection({
  host: 'localhost',  // Your MySQL host (usually localhost)
  user: 'root',       // Your MySQL user
  password: '' // Your MySQL password
});

// Connect to MySQL and create the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }

  const query = 'CREATE DATABASE IF NOT EXISTS ecommerce_db';

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database "ecommerce_db" created or already exists.');
  });

  connection.end();
});
