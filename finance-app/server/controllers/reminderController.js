// controllers/reminderController.js
const Reminder = require('../models/Reminder');

exports.createReminder = async (req, res) => {
  try {
    const newReminder = new Reminder({
      user: req.user.id,
      ...req.body
    });
    const savedReminder = await newReminder.save();
    res.status(201).json(savedReminder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating reminder', error: error.message });
  }
};

exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reminders', error: error.message });
  }
};

exports.updateReminder = async (req, res) => {
  try {
    const updatedReminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedReminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.json(updatedReminder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating reminder', error: error.message });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const deletedReminder = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedReminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reminder', error: error.message });
  }
};
