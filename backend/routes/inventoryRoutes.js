const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const ctrl = require('../controllers/inventoryController');

const router = express.Router();
router.use(protect);

router.get('/history', ctrl.history);
router.post('/in', authorize('admin', 'pharmacist'), ctrl.stockIn);
router.post('/out', authorize('admin', 'pharmacist'), ctrl.stockOut);
router.post('/transfer', authorize('admin', 'pharmacist'), ctrl.transfer);

module.exports = router;
