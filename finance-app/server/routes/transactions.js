const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Goal = require('../models/Goals');
const auth = require('../middleware/auth');

// Get all transactions for a user
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new transaction
router.post('/', auth, async (req, res) => {
  try {
    const { description, amount, type, category, date, budget, goal } = req.body;
    
    const transactionData = {
      user: req.user.id,
      description,
      amount,
      type,
      category,
      date
    };

    if (type === 'expense' && budget) {
      transactionData.budget = budget;
    } else if (type === 'income' && goal) {
      transactionData.goal = goal;
    }

    const transaction = new Transaction(transactionData);
    await transaction.save();

    // Update budget or goal as needed
    if (type === 'expense' && budget) {
      await Budget.findByIdAndUpdate(budget, { $inc: { spent: amount } });
    } else if (type === 'income' && goal) {
      await Goal.findByIdAndUpdate(goal, { $inc: { currentAmount: amount } });
    }

    res.status(201).json(transaction);
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a transaction
router.patch('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    const oldBudget = transaction.budget;
    const oldGoal = transaction.goal;
    const oldAmount = transaction.amount;
    const oldType = transaction.type;

    Object.keys(req.body).forEach(key => {
      transaction[key] = req.body[key];
    });

    const updatedTransaction = await transaction.save();

    // Handle budget changes
    if (oldType === 'expense' && oldBudget) {
      await Budget.findByIdAndUpdate(oldBudget, { $inc: { spent: -oldAmount } });
    }
    if (updatedTransaction.type === 'expense' && updatedTransaction.budget) {
      await Budget.findByIdAndUpdate(updatedTransaction.budget, { $inc: { spent: updatedTransaction.amount } });
    }

    // Handle goal changes
    if (oldType === 'income' && oldGoal) {
      await Goal.findByIdAndUpdate(oldGoal, { $inc: { currentAmount: -oldAmount } });
    }
    if (updatedTransaction.type === 'income' && updatedTransaction.goal) {
      await Goal.findByIdAndUpdate(updatedTransaction.goal, { $inc: { currentAmount: updatedTransaction.amount } });
    }

    res.json(updatedTransaction);
  } catch (err) {
    console.error('Error updating transaction:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    // Update budget or goal before deleting
    if (transaction.type === 'expense' && transaction.budget) {
      await Budget.findByIdAndUpdate(transaction.budget, { $inc: { spent: -transaction.amount } });
    } else if (transaction.type === 'income' && transaction.goal) {
      await Goal.findByIdAndUpdate(transaction.goal, { $inc: { currentAmount: -transaction.amount } });
    }

    await transaction.remove();
    res.json({ message: 'Transaction removed' });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
