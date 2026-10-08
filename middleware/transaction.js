const { body, validationResult } = require('express-validator');
const ObjectId = require('mongodb').ObjectId;

const transactionValidationRules = () => {
    return [
        // Period ID must not be empty and must be a string
        body('periodId')
            .notEmpty()
            .isString(),

        // Category ID must not be empty and must be a string
        body('categoryId')
            .notEmpty()
            .isString(),

        // Date must not be empty and must be a string
        body('date')
            .notEmpty()
            .isString(),

        // Origin/Destination must not be empty and must be a string
        body('originDestination')
            .notEmpty()
            .isString(),

        // Details must not be empty and must be a string
        body('details')
            .notEmpty()
            .isString(),

        // Amount must not be empty and must be a number
        body('amount')
            .notEmpty()
            .isNumeric(),

        // Payment method must not be empty and must be a string
        body('paymentMethod')
            .notEmpty()
            .isString()
    ]
};

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(400).json({
        errors: extractedErrors,
    })
};

const validateId = (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: 'Invalid ID'
        });
    }
    next();
}

module.exports = {
    transactionValidationRules,
    validate,
    validateId
};