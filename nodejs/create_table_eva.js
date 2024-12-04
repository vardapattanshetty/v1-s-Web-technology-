// create_tables.js
const mysql = require('mysql');

// Create a connection to the "ecommerce_db" database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecommerce_db'  // Connect to the ecommerce_db database
});

// SQL queries to create the tables
const createTables = () => {
  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL
    )
  `;

  const createProductsTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      product_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      user_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
  `;

  const createReviewsTableQuery = `
    CREATE TABLE IF NOT EXISTS reviews (
      review_id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT,
      user_id INT,
      review_text TEXT,
      rating INT CHECK (rating BETWEEN 1 AND 5),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(product_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
  `;

  connection.query(createUsersTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating users table:', err);
      return;
    }
    console.log('Users table created or already exists.');
  });

  connection.query(createProductsTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating products table:', err);
      return;
    }
    console.log('Products table created or already exists.');
  });

  connection.query(createReviewsTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating reviews table:', err);
      return;
    }
    console.log('Reviews table created or already exists.');
  });

  connection.end();
};

createTables();








