import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const categories = ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Other'];

const TransactionForm = () => {
  const { addTransaction } = useContext(AppContext);
  const [transaction, setTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'Other',
    date: new Date().toISOString().substr(0, 10)
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addTransaction(transaction);
      setTransaction({
        description: '',
        amount: '',
        type: 'expense',
        category: 'Other',
        date: new Date().toISOString().substr(0, 10)
      });
    } catch (err) {
      setError('Failed to add transaction');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Transaction</h2>
      {error && <p className="error">{error}</p>}
      <div>
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={transaction.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={transaction.amount}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="type">Type</label>
        <select id="type" name="type" value={transaction.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <select id="category" name="category" value={transaction.category} onChange={handleChange}>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={transaction.date}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Add Transaction</button>
    </form>
  );
};

export default TransactionForm;
