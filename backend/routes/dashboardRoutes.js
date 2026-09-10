const express = require('express');
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/dashboardController');

const router = express.Router();
router.use(protect);
router.get('/', ctrl.getDashboard);

module.exports = router;
