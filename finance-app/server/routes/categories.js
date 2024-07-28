const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Category = require('../models/Category'); // Assuming you have a Category model

// @route   GET api/categories
// @desc    Get all categories
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const newCategory = new Category({
      name: req.body.name,
      user: req.user.id
    });
    const category = await newCategory.save();
    res.status(201).json(category);
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
