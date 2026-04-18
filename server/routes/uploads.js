const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  // Determine subfolder based on the original destination to match buildImageUrl logic
  const sub = req.file.destination.split(require('path').sep).pop();
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${sub}/${req.file.filename}`;

  res.json({
    success: true,
    url: imageUrl,
    filename: req.file.filename
  });
});

module.exports = router;
