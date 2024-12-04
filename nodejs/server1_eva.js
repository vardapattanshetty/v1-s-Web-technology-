
// server.js
const express = require('express');
const mysql = require('mysql');

// Create the Express app
const app = express();
app.use(express.json());  // To parse JSON data in request bodies

// Create a connection to MySQL database
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'ecommerce_db'
});

// Connect to MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// 1. Retrieve the latest 5 products added to the catalog (including the username of the user who added each product)
app.get('/products/latest', (req, res) => {
  const query = `
    SELECT p.product_id, p.name, p.description, p.price, p.created_at, u.username
    FROM products p
    JOIN users u ON p.user_id = u.user_id
    ORDER BY p.created_at DESC
    LIMIT 5
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching latest products:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(results);
  });
});

// 2. Add a new product to the database
app.post('/products', (req, res) => {
  const { name, description, price, user_id } = req.body;

  if (!name || !description || !price || !user_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO products (name, description, price, user_id, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  connection.query(query, [name, description, price, user_id], (err, result) => {
    if (err) {
      console.error('Error adding product:', err);
      return res.status(500).json({ error: 'Failed to add product' });
    }
    res.status(201).json({ product_id: result.insertId });
  });
});

// 3. Retrieve all reviews for a specific product (including the username of the user who wrote each review)
app.get('/products/:product_id/reviews', (req, res) => {
  const { product_id } = req.params;

  const query = `
    SELECT r.review_id, r.review_text, r.rating, u.username
    FROM reviews r
    JOIN users u ON r.user_id = u.user_id
    WHERE r.product_id = ?
  `;

  connection.query(query, [product_id], (err, results) => {
    if (err) {
      console.error('Error fetching reviews:', err);
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }
    res.json(results);
  });
});

// 4. Delete a review from the database based on its ID
app.get('/reviews/:review_id', (req, res) => {
  const { review_id } = req.params;

  const query = `DELETE FROM reviews WHERE review_id = ?`;

  connection.query(query, [review_id], (err, result) => {
    if (err) {
      console.error('Error deleting review:', err);
      return res.status(500).json({ error: 'Failed to delete review' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
