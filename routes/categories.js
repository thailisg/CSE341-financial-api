const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories');
const { categoryValidationRules, validate } = require('../middleware/categories');
const { isAuthenticated } = require("../middleware/authenticate")

router.get('/', categoriesController.getAllCategories);
router.get('/:id', categoriesController.getSingleCategory);
router.post('/', isAuthenticated, categoryValidationRules(), validate, categoriesController.createCategory);
router.put('/:id', isAuthenticated, categoryValidationRules(), validate, categoriesController.updateCategory);
router.delete('/:id', isAuthenticated, categoriesController.deleteCategory);

module.exports = router;

