const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database connection
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "ecommerce_db"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to the ecommerce database!");
});

// Home Page with Forms
app.get('/', (req, res) => {
    const html = `
        <h1>ecomerce Management System</h1>
        <h2>Add a New products</h2>

        name, description, price, user_id

        <form action="/addproducts" method="POST">
        product id: <input type="number" name="product_id" required><br>
            Name: <input type="text" name="name" required><br>
            description: <input type="text" name="description" required><br>
            price: <input type="number" name="price" required><br>
            user_id: <input type="number" name="user_id" required><br>
            <button type="submit">Add Book</button>
        </form>
        
        
        
        <h2>Delete a product</h2>
        <form action="/deleteproducts" method="POST">
            product ID: <input type="number" name="product_id" required><br>
            <button type="submit">Delete product</button>
        </form>

        <h2>View All products</h2>
        <form action="/products" method="GET">
            <button type="submit">View products</button>
        </form>
    `;
    res.send(html);
});

// Retrieve the list of all books with authors
app.get('/products', function (req, res) {
    const sql = `
        SELECT p.product_id, p.name, p.description, p.price, u.user_id, p.created_at
        FROM products p
        JOIN users u ON u.user_id = p.user_id;
    `;
    con.query(sql, function (err, results) {
        if (err) {
            console.error("Error fetching products:", err);
            return res.status(500).send("Error fetching products.");
        }

        let html = `<h1>All Books</h1>
        <table border="1">
        <tr><th>product ID</th><th>name</th><th>description</th><th>price </th><th>user_id</th><th>created_at</th></tr>`;
        results.forEach(book => {
            html += `<tr><td>${products.product_id}</td><td>${products.name}</td><td>${products.description}</td><td>${products.price}</td><td>${products.created_at}</td></tr>`;
        });
        html += `</table><a href="/">Go Back</a>`;
        res.send(html);
    });
});

// Add a new book to the inventory
app.post('/addproducts', function (req, res) {
    const { name, description, price, user_id } = req.body;

    if (!name|| !description || !price || !user_id ) {
        return res.status(400).send("All fields are required.");
    }

    const findAuthorSql = `SELECT username FROM users WHERE user_id = ?`;
    con.query(findAuthorSql, [user_id], function (err, results) {
        if (err) {
            console.error("Error checking user:", err);
            return res.status(500).send("Error checking user.");
        }

        if (results.length > 0) {
            const user_id = results[0].user_id;
            const addBookSql = `
                INSERT INTO products (name, description, price, user_id)
                VALUES (?, ?, ?, ?)
            `;
            con.query(addBookSql, [name, description, price, user_id], function (err) {
                if (err) {
                    console.error("Error adding product:", err);
                    return res.status(500).send("Error adding product.");
                }
                res.send(`<h1>product added successfully.</h1><a href="/">Go Back</a>`);
            });
        } else {
            const addAuthorSql = `INSERT INTO users (user_id) VALUES (?)`;
            con.query(addAuthorSql, [user_id], function (err, result) {
                if (err) {
                    console.error("Error adding user:", err);
                    return res.status(500).send("Error adding user.");
                }

                const user_id = result.insertId;
                const addBookSql = `
                    INSERT INTO users (name, description, price, user_id)
                    VALUES (?, ?, ?, ?)
                `;
                con.query(addBookSql, [name, description, price, user_id], function (err) {
                    if (err) {
                        console.error("Error adding product:", err);
                        return res.status(500).send("Error adding product.");
                    }
                    res.send(`<h1>Book and author added successfully.</h1><a href="/">Go Back</a>`);
                });
            });
        }
    });
});


// Delete a book by its ID
app.post('/deleteproducts', function (req, res) {
    const { product_id } = req.body;

    const sql = `DELETE FROM products WHERE product_id = ?`;
    con.query(sql, [product_id], function (err, result) {
        if (err) {
            console.error("Error deleting product:", err);
            return res.status(500).send("Error deleting product.");
        }
        if (result.affectedRows === 0) {
            res.status(404).send(`<h1>product not found.</h1><a href="/">Go Back</a>`);
        } else {
            res.send(`<h1>product deleted successfully.</h1><a href="/">Go Back</a>`);
        }
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
