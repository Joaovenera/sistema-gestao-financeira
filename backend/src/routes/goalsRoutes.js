const express = require('express');
const router = express.Router();
const goalsController = require('../controllers/goalsController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', goalsController.getGoals);
router.post('/', goalsController.createGoal);
router.put('/:id', goalsController.updateGoal);
router.delete('/:id', goalsController.deleteGoal);

module.exports = router; 