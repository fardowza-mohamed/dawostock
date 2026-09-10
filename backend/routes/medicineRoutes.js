const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { validate } = require('../middleware/validate');
const ctrl = require('../controllers/medicineController');

const router = express.Router();
router.use(protect);

router.get('/', ctrl.list);
router.get('/export/csv', authorize('admin', 'pharmacist'), ctrl.exportCsv);
router.get('/:id', ctrl.getOne);
router.post('/', authorize('admin', 'pharmacist'), ctrl.medicineValidators, validate, ctrl.create);
router.put('/:id', authorize('admin', 'pharmacist'), ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove);

module.exports = router;
