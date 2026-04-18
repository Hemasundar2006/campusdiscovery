const fs = require('fs');
const path = require('path');

const deleteFile = (filePath) => {
  if (!filePath) return;

  const abs = path.isAbsolute(filePath)
    ? filePath
    : path.join(__dirname, '..', filePath);

  fs.unlink(abs, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Failed to delete file:', err.message);
    }
  });
};

module.exports = deleteFile;
