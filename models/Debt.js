const mongoose = require('mongoose');

const debtSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  creditor: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Debt', debtSchema);
