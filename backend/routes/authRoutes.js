const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { validate } = require('../middleware/validate');
const ctrl = require('../controllers/authController');

const router = express.Router();

router.post('/login', ctrl.loginValidators, validate, ctrl.login);
router.post('/register', protect, authorize('admin'), ctrl.registerValidators, validate, ctrl.register);
router.get('/me', protect, ctrl.me);

module.exports = router;
