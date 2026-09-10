const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const ctrl = require('../controllers/reportController');

const router = express.Router();
router.use(protect, authorize('admin', 'pharmacist'));

router.get('/inventory', ctrl.inventory);
router.get('/sales', ctrl.sales);
router.get('/revenue', ctrl.revenue);
router.get('/suppliers', ctrl.suppliers);
router.get('/expiry', ctrl.expiry);

module.exports = router;
