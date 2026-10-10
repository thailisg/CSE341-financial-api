const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllBudgets = async (req, res) => {
    //#swagger.tags = ['Budgets']
    try {
        const result = await mongodb.getDatabase().db().collection('budgets').find();
        result.toArray().then((budgets) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(budgets);
        });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Error occurred while getting budgets.' });
    }
};

const getSingleBudget = async (req, res) => {
    //#swagger.tags = ['Budgets']
    try {
        if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid budget id to find a budget.');
        }
        const budgetId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('budgets').find({ _id: budgetId });
        result.toArray().then((budgets) => {
        if (budgets.length === 0) {
            return res.status(404).json({ message: 'Budget not found.' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(budgets[0]);
        });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Error occurred while getting budget.' });
    }
};

const createBudget = async (req, res) => {
    //#swagger.tags = ['Budgets']
    try {
        const budget = {
        category_id: req.body.category_id,
        amount: req.body.amount,
        period_id: req.body.period_id,
        start_date: req.body.start_date,
        end_date: req.body.end_date
        };
        const response = await mongodb.getDatabase().db().collection('budgets').insertOne(budget);
        if (response.acknowledged) {
        res.status(201).json(response);
        } else {
        res.status(500).json(response.error || 'Some error occurred while creating the budget.');
        }
    } catch (err) {
        res.status(500).json({ message: err.message || 'Error occurred while creating budget.' });
    }
};

const updateBudget = async (req, res) => {
    //#swagger.tags = ['Budgets']
    try {
        if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid budget id to update a budget.');
        }
        const budgetId = new ObjectId(req.params.id);
        const budget = {
        category_id: req.body.category_id,
        amount: req.body.amount,
        period_id: req.body.period_id,
        start_date: req.body.start_date,
        end_date: req.body.end_date
        };
        const response = await mongodb
        .getDatabase()
        .db()
        .collection('budgets')
        .replaceOne({ _id: budgetId }, budget);
        if (response.modifiedCount > 0) {
        res.status(204).send();
        } else {
        res.status(500).json(response.error || 'Some error occurred while updating the budget.');
        }
    } catch (err) {
        res.status(500).json({ message: err.message || 'Error occurred while updating budget.' });
    }
};

const deleteBudget = async (req, res) => {
    //#swagger.tags = ['Budgets']
    try {
        if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid budget id to delete a budget.');
        }
        const budgetId = new ObjectId(req.params.id);
        const response = await mongodb
        .getDatabase()
        .db()
        .collection('budgets')
        .deleteOne({ _id: budgetId });
        if (response.deletedCount > 0) {
        res.status(200).send();
        } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the budget.');
        }
    } catch (err) {
        res.status(500).json({ message: err.message || 'Error occurred while deleting budget.' });
    }
    };

module.exports = {
    getAllBudgets,
    getSingleBudget,
    createBudget,
    updateBudget,
    deleteBudget
};