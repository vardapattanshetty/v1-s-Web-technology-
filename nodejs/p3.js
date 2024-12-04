const express = require('express');
const app = express();

// Route to return a JSON response
app.get('/data', (req, res) => {
  const data = {
    name: 'John Doe',
    age: 30,
    city: 'New York'
  };
  res.json(data);  // Sends the response as JSON
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
