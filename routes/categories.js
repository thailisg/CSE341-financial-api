const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories');
const { categoryValidationRules, validate } = require('../middleware/categories');

router.get('/', categoriesController.getAllCategories);
router.get('/:id', categoriesController.getSingleCategory);
router.post('/', categoryValidationRules(), validate, categoriesController.createCategory);
router.put('/:id', categoryValidationRules(), validate, categoriesController.updateCategory);
router.delete('/:id', categoriesController.deleteCategory);

module.exports = router;

