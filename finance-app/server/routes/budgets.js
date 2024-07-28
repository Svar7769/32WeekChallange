const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

// Get all budgets for a user
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({ date: -1 });
    res.json(budgets);
  } catch (err) {
    console.error('Error fetching budgets:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new budget
router.post('/', auth, async (req, res) => {
  try {
    const budget = new Budget({ ...req.body, user: req.user.id });
    const newBudget = await budget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    console.error('Error creating budget:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a budget
router.patch('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    Object.keys(req.body).forEach(key => {
      budget[key] = req.body[key];
    });

    const updatedBudget = await budget.save();
    res.json(updatedBudget);
  } catch (err) {
    console.error('Error updating budget:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a budget
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    await budget.remove();
    res.json({ message: 'Budget removed' });
  } catch (err) {
    console.error('Error deleting budget:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
