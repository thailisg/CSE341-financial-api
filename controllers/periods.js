 const mongodb = require('../data/database');
 const { validationResult } = require('express-validator');
 const ObjectId = require('mongodb').ObjectId;

 const getAllPeriods = async (req, res) => {
  // #swagger.tags=['Periods'];
  try {
    const result = await mongodb.getDatabase().db().collection('periods').find();
    result.toArray().then((periods) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(periods);
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch periods' });
  }  
};

const getPeriodById = async (req, res) => {
  // #swagger.tags=['Periods'];
  const periodId = req.params.id;    
  try {
    const result = await mongodb.getDatabase().db().collection('periods').find({ _id: new ObjectId(periodId)});
    result.toArray().then((periods) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(periods[0]);
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch periods' });
  }
};

const createPeriod = async (req, res) => {
  // #swagger.tags=['Periods']
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newPeriod = {
    month: req.body.month,
    year: req.body.year,
    label: req.body.label,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    isClosed: req.body.isClosed,
    notes: req.body.notes,
    totalIncome: req.body.totalIncome,
    totalExpenses: req.body.totalExpenses
  }

  try {
    const result = await mongodb.getDatabase().db().collection('periods').insertOne(newPeriod);
    if (result.acknowledged) {
      res.status(201).json(result);
    } else {
      res.status(500).json({ error: 'Failed to create period' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePeriod = async (req, res) => {
    // #swagger.tags=['Periods']
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Must use a valid period ID to update.' });
        }

        const periodId = req.params.id;
        const updatedPeriod = {
            month: req.body.month,
            year: req.body.year,
            label: req.body.label,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            isClosed: req.body.isClosed,
            notes: req.body.notes,
            totalIncome: req.body.totalIncome,
            totalExpenses: req.body.totalExpenses
        };
        const result = await mongodb.getDatabase().db().collection('periods').replaceOne({ _id: new ObjectId(periodId)}, updatedPeriod);
            
            if (result.matchedCount > 0) {
                res.status(204).json('Period updated successfully');
            } else {
                res.status(404).json({ error: 'Period not found to update' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Failed to update period due to server error', message: err.message });
        }
    };

const deletePeriod = async (req, res) => {
    // #swagger.tags=['Periods']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Must use a valid period ID to delete.' });
        }

        const periodId = req.params.id;
        
        const result = await mongodb.getDatabase().db().collection('periods').deleteOne({ _id: new ObjectId(periodId)});
        
        if (result.deletedCount > 0) {
            res.status(200).json('Period deleted successfully');
        } else {
            res.status(404).json({ error: 'Period not found to delete' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete period due to server error', message: err.message });
    }
};

module.exports = {
  getAllPeriods,
  getPeriodById,
  createPeriod,
  updatePeriod,
  deletePeriod
};