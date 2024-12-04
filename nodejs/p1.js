// Import express module
const express = require('express');

// Create an Express application
const app = express();

// Define a route for the home page
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Define a route for the /about page
app.get('/about', (req, res) => {
  res.send('This is a simple Express application.');
});

// Start the server and listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
