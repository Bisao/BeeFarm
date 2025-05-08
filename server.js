
const express = require('express');
const multer = require('multer');
const { MarkItDown } = require('@microsoft/markitdown');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/convert', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const converter = new MarkItDown();
    const markdown = await converter.convert(req.file.path);
    res.json({ markdown });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on port 5000');
});
