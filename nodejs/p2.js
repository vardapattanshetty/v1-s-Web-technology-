const express = require('express');
const app = express();

// Route with query parameters
app.get('/greet', (req, res) => {
  const name = req.query.name || 'Guest';  // Default to 'Guest' if no name is provided
  res.send(`Hello, ${name}!`);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
