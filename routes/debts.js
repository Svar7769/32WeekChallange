const express = require('express');
const router = express.Router();
const debtController = require('../controllers/debtController');

// Check if debtController and its methods are defined
console.log(debtController);

router.post('/', debtController.createDebt);

router.get('/', debtController.getAllDebts);
router.post('/', debtController.createDebt);
router.get('/:id', debtController.getDebt);
router.patch('/:id', debtController.updateDebt);
router.delete('/:id', debtController.deleteDebt);

module.exports = router;
