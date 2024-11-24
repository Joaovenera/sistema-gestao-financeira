const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const transactionValidator = require('../validators/transactionValidator');

router.use(auth);

router.get('/', transactionController.getTransactions);
router.post('/', validateRequest(transactionValidator.create), transactionController.createTransaction);
router.put('/:id', validateRequest(transactionValidator.update), transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router; 