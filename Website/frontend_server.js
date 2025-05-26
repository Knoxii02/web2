const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Define a catch-all route to serve index.html for any other request
// This is useful for single-page applications or to ensure direct navigation works
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'html', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server is running on http://localhost:${PORT}`);
});
