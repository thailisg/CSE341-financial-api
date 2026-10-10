const { body, validationResult } = require('express-validator');

const budgetValidationRules = () => {
    return [
        body('category_id')
        .trim()
        .notEmpty()
        .withMessage('Category ID is required.'),
        body('amount')
        .notEmpty()
        .withMessage('Amount is required.')
        .isNumeric()
        .withMessage('Amount must be a number.'),
        body('period_id')
        .trim()
        .notEmpty()
        .withMessage('Period ID is required.'),
        body('start_date')
        .trim()
        .notEmpty()
        .withMessage('Start date is required.'),
        body('end_date')
        .trim()
        .notEmpty()
        .withMessage('End date is required.')
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(422).json({ errors: errors.array() });
};

module.exports = {
    budgetValidationRules,
    validate
};