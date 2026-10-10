const express = require('express');
const router = express.Router();

const budgetsController = require('../controllers/budgets');
const { isAuthenticated } = require('../middleware/authenticate');
const { budgetValidationRules, validate } = require('../middleware/budgets');

router.get('/', budgetsController.getAllBudgets);
router.get('/:id', budgetsController.getSingleBudget);

router.post('/', isAuthenticated, budgetValidationRules(), validate, budgetsController.createBudget);
router.put('/:id', isAuthenticated, budgetValidationRules(), validate, budgetsController.updateBudget);
router.delete('/:id', isAuthenticated, budgetsController.deleteBudget);

module.exports = router;