const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { uploadLogo } = require('../middleware/upload');
const ctrl = require('../controllers/settingsController');

const router = express.Router();

// Public endpoint (unauthenticated) for website header/footer/contacts
router.get('/public', ctrl.getPublic);

// Protected endpoints for staff & admin
router.use(protect);
router.get('/', ctrl.get);
router.put('/', authorize('admin'), ctrl.update);
router.post('/logo', authorize('admin'), uploadLogo, ctrl.uploadLogo);

module.exports = router;
