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
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

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

    Object.keys(req.body).forEach(key => {
      transaction[key] = req.body[key];
    });

    const updatedTransaction = await transaction.save();

    // Handle budget changes
    if (oldBudget && oldBudget.toString() !== updatedTransaction.budget.toString()) {
      // Remove transaction from old budget
      await Budget.findByIdAndUpdate(oldBudget, {
        $pull: { transactions: updatedTransaction._id }
      });
    }

    if (updatedTransaction.budget) {
      // Add transaction to new budget
      await Budget.findByIdAndUpdate(updatedTransaction.budget, {
        $addToSet: { transactions: updatedTransaction._id }
      });
    }

    res.json(updatedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await transaction.remove();
    res.json({ msg: 'Transaction removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
