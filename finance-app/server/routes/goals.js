const express = require('express');
const router = express.Router();
const Goal = require('../models/Goals');
const auth = require('../middleware/auth');

// Get all goals for a user
router.get('/', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ date: -1 });
    res.json(goals);
  } catch (err) {
    console.error('Error fetching goals:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new goal
router.post('/', auth, async (req, res) => {
  try {
    const goal = new Goal({ ...req.body, user: req.user.id });
    const newGoal = await goal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    console.error('Error creating goal:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a goal
router.patch('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    Object.keys(req.body).forEach(key => {
      goal[key] = req.body[key];
    });

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (err) {
    console.error('Error updating goal:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a goal
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    await goal.remove();
    res.json({ message: 'Goal removed' });
  } catch (err) {
    console.error('Error deleting goal:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
