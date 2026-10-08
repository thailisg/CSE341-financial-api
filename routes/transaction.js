const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transactions')
const validation = require('../middleware/transaction');
//const { isAuthenticated } = require("../middleware/authenticate")  this is for future Aoath

//route for get all transactions
router.get('/', transactionController.getAll);

//route for get single transaction
router.get('/:id',
    validation.validateId,
    transactionController.getSingle
);

//route to Create an transaction
router.post('/',
    //isAuthenticated, future authentication
    validation.transactionValidationRules(),
    validation.validate,
    transactionController.createTransaction
);

//route for update an transaction
router.put('/:id',
    //isAuthenticated, future authentication
    validation.validateId,
    validation.transactionValidationRules(),
    validation.validate,
    transactionController.updateSingleTransaction
);

//route for delete an arttransaction 
router.delete('/:id',
    //isAuthenticated,
    validation.validateId,
    transactionController.deleteTransaction
);

module.exports = router;