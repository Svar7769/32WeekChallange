// In your transaction model (models/Transaction.js)

const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  budget: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget',
    required: function() { return this.type === 'expense'; }
  },
  goal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: function() { return this.type === 'income'; }
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
