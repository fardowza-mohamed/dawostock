const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { validate } = require('../middleware/validate');
const ctrl = require('../controllers/saleController');

const router = express.Router();
router.use(protect);

router.get('/', ctrl.list);
router.get('/customer', ctrl.customerHistory);
router.get('/:id', ctrl.getOne);
router.post('/', authorize('admin', 'pharmacist', 'staff'), ctrl.saleValidators, validate, ctrl.create);

module.exports = router;
