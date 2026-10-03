const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const periodController = require('../controllers/periods');

router.get('/', periodController.getAllPeriods);
router.get('/:id', periodController.getPeriodById);
router.post(
    '/', 
    body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be an integer between 1 and 12'),
    body('year').isInt({ min: 1900 }).withMessage('Year must be an integer greater than or equal to 1900'),
    body('label').isString().withMessage('Label must be a string'),
    body('startDate').isISO8601().withMessage('Start date must be a valid date'),
    body('endDate').isISO8601().withMessage('End date must be a valid date'),
    body('isClosed').isBoolean().withMessage('isClosed must be a boolean'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
    body('totalIncome').isFloat({ min: 0 }).withMessage('Total income must be a non-negative number'),
    body('totalExpenses').isFloat({ min: 0 }).withMessage('Total expenses must be a non-negative number'),
    periodController.createPeriod);
router.put('/:id', 
    body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be an integer between 1 and 12'),
    body('year').isInt({ min: 1900 }).withMessage('Year must be an integer greater than or equal to 1900'),
    body('label').isString().withMessage('Label must be a string'),
    body('startDate').isISO8601().withMessage('Start date must be a valid date'),
    body('endDate').isISO8601().withMessage('End date must be a valid date'),
    body('isClosed').isBoolean().withMessage('isClosed must be a boolean'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
    body('totalIncome').isFloat({ min: 0 }).withMessage('Total income must be a non-negative number'),
    body('totalExpenses').isFloat({ min: 0 }).withMessage('Total expenses must be a non-negative number'),
    periodController.updatePeriod);
router.delete('/:id', periodController.deletePeriod);

module.exports = router;