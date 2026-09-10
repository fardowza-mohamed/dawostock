const path = require('path');
const fs = require('fs');
const multer = require('multer');
const config = require('../config');
const { AppError } = require('./errorHandler');

const logoDir = path.join(__dirname, '..', 'uploads', 'logos');
fs.mkdirSync(logoDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, logoDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `logo-${Date.now()}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new AppError('Only JPEG, PNG, WEBP, or GIF images are allowed.', 400));
  }
  cb(null, true);
};

const uploadLogo = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.maxUploadMb * 1024 * 1024 },
}).single('logo');

module.exports = { uploadLogo };
