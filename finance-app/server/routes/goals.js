const express = require('express');
const router = express.Router();
const Goal = require('../models/Goals');
const auth = require('../middleware/auth');

// Get all goals for a user
router.get('/', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).populate('category');
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new goal
router.post('/', auth, async (req, res) => {
  const goal = new Goal({
    ...req.body,
    user: req.user.id,
    currentAmount: 0
  });

  try {
    const newGoal = await goal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a goal
router.patch('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    Object.keys(req.body).forEach(key => {
      goal[key] = req.body[key];
    });

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a goal
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.patch('/:id/progress', auth, async (req, res) => {
  try {
    const { amount, type } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (type === 'income') {
      goal.currentAmount += parseFloat(amount);
    } else if (type === 'delete') {
      goal.currentAmount -= parseFloat(amount); // Subtract the amount when deleting a transaction
    }

    // Ensure currentAmount doesn't go below 0 or exceed targetAmount
    goal.currentAmount = Math.max(0, Math.min(goal.currentAmount, goal.targetAmount));

    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;
