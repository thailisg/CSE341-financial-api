const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

//function to get all transactions
const getAllTransactions = async (req, res, next) => {
    // #swagger.tags = ['Transactions']
    try {
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('transactions')
            .find();
        const transactions = await result.toArray();

        res.setHeader('content-Type', 'application/json');
        res.status(200).json(transactions);

    } catch (error) {
        next(error);
    }
}

//function to get a single transaction
const getSingleTransactions = async (req, res, next) => {
    // #swagger.tags = ['Transactions']
    try {
        console.log("ID:", req.params.id);

        const transactionId = new ObjectId(req.params.id);

        const result = await mongodb
            .getDatabase()
            .db()
            .collection('transactions')
            .find({ _id: transactionId });


        const transaction = await result.toArray();

        if (transaction.length === 0) {
            res.status(404).json("transaction not found");
        } else {
            res.setHeader('content-Type', 'application/json');
            res.status(200).json(transaction[0]);
        }

    } catch (error) {
        next(error);
    }
}

//function to create a new transaction
const createTransaction = async (req, res, next) => {
    // #swagger.tags = ['Transactions']
    try {
        const transaction = {
            periodId: new ObjectId(req.body.periodId),
            categoryId: new ObjectId(req.body.categoryId),
            date: req.body.date,
            originDestination: req.body.originDestination,
            details: req.body.details,
            amount: req.body.amount,
            paymentMethod: req.body.paymentMethod
        };

        const result = await mongodb
            .getDatabase()
            .db()
            .collection('transactions')
            .insertOne(transaction);

        res.status(200).json({
            message: 'Transaction created successfully',
            transactionId: result.insertedId
        });
    } catch (error) {
        next(error);
    }
};

//Function to Update a single transaction
const updateSingleTransaction = async (req, res, next) => {
    // #swagger.tags = ['Transactions']
    try {
        console.log("ID:", req.params.id);

        const transactionId = new ObjectId(req.params.id);

        const transaction = {
            periodId: new ObjectId(req.body.periodId),
            categoryId: new ObjectId(req.body.categoryId),
            date: req.body.date,
            originDestination: req.body.originDestination,
            details: req.body.details,
            amount: req.body.amount,
            paymentMethod: req.body.paymentMethod
        }

        const result = await mongodb
            .getDatabase()
            .db()
            .collection('transactions')
            .replaceOne({ _id: transactionId }, transaction);

        if (result.matchedCount === 0) {
            res.status(404).json("Transaction not found");
        } else {
            res.status(200).send();
        }
    } catch (error) {
        next(error);
    }
}

//Function to Delete a single transaction
const deleteTransaction = async (req, res, next) => {
    // #swagger.tags = ['Transactions']
    try {
        console.log("ID:", req.params.id);

        const transactionId = new ObjectId(req.params.id);

        const result = await mongodb
            .getDatabase()
            .db()
            .collection('transactions')
            .deleteOne({ _id: transactionId });

        if (result.deletedCount === 1) {
            res.status(200).send();
        } else {
            res.status(404).json("transaction not found");
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllTransactions,
    getSingleTransactions,
    createTransaction,
    updateSingleTransaction,
    deleteTransaction
};