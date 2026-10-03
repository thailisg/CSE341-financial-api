const mongodb = require('../data/database'); 
const { ObjectId } = require('mongodb');

// 1. GET all 
const getAllCategories = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('categories').find();
    const lists = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving categories', error: error.message });
  }
};

// 2. GET a single category by ID
const getSingleCategory = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid category ID.' });
    }
    const categoryId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('categories').find({ _id: categoryId });
    const lists = await result.toArray();
    
    if (lists.length === 0) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]); 
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving category', error: error.message });
  }
};

// 3. POST Create a new category
const createCategory = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    const newCategory = {
      name: req.body.name,
      description: req.body.description || '',
      color: req.body.color || '#ffffff'
    };
    
    const response = await mongodb.getDb().db().collection('categories').insertOne(newCategory);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: 'Error occurred while creating category.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// 4. PUT Update an existing category by id  
const updateCategory = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid category ID to update.' });
    }
    
    if (!req.body.name) {
      return res.status(400).json({ message: 'Category name is required to update.' });
    }

    const categoryId = new ObjectId(req.params.id);
    const updatedCategory = {
      name: req.body.name,
      description: req.body.description || '',
      color: req.body.color || '#ffffff'
    };
    
    const response = await mongodb.getDb().db().collection('categories').replaceOne({ _id: categoryId }, updatedCategory);
    
    if (response.matchedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Category not found to update.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// 5. DELETE Remove a category document by id
const deleteCategory = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid category ID to delete.' });
    }
    const categoryId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('categories').deleteOne({ _id: categoryId });
    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'Category deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Category not found to delete.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};


module.exports = { 
  getAllCategories, 
  getSingleCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory 
};
