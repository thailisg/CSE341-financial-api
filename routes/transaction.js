const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transactions')
const validation = require('../middleware/transaction');
const { isAuthenticated } = require("../middleware/authenticate")

//route for get all transactions
router.get('/', transactionController.getAllTransactions);

//route for get single transaction
router.get('/:id',
    validation.validateId,
    transactionController.getSingleTransactions
);

//route to Create an transaction
router.post('/',
    isAuthenticated,
    validation.transactionValidationRules(),
    validation.validate,
    transactionController.createTransaction
);

//route for update an transaction
router.put('/:id',
    isAuthenticated,
    validation.validateId,
    validation.transactionValidationRules(),
    validation.validate,
    transactionController.updateSingleTransaction
);

//route for delete an arttransaction 
router.delete('/:id',
    isAuthenticated,
    validation.validateId,
    transactionController.deleteTransaction
);

module.exports = router;