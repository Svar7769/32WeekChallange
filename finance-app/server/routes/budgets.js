// routes/budgets.js
const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

// Get all budgets for a user
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).populate('category');
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific budget
router.get('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id }).populate('category');
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new budget
router.post('/', auth, async (req, res) => {
  const budget = new Budget({
    ...req.body,
    user: req.user.id
  });

  try {
    const newBudget = await budget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id/spend', auth, async (req, res) => {
  try {
    const { amount, type } = req.body;
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (type === 'expense') {
      budget.spent += parseFloat(amount);
    } else if (type === 'income') {
      budget.spent -= parseFloat(amount);
    } else if (type === 'delete') {
      budget.spent -= parseFloat(amount); // Subtract the amount when deleting a transaction
    }

    // Ensure spent doesn't go below 0
    budget.spent = Math.max(0, budget.spent);

    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a budget
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update budget spending
router.patch('/:id/spend', auth, async (req, res) => {
  try {
    const { amount, type } = req.body;
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (type === 'expense') {
      budget.spent += parseFloat(amount);
    } else if (type === 'income') {
      budget.spent -= parseFloat(amount);
    }

    // Ensure spent doesn't go below 0
    budget.spent = Math.max(0, budget.spent);

    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
