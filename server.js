
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('.'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Server running at http://0.0.0.0:5000');
});
