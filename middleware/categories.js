const { body, validationResult } = require('express-validator');

const categoryValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Category name is required.')
      .isLength({ min: 3 })
      .withMessage('Category name must be at least 3 characters long.')
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
  categoryValidationRules,
  validate
};
