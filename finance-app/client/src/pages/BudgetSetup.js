// BudgetSetup.js
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './BudgetSetup.css';

const BudgetSetup = () => {
  const { budgets, addBudget } = useContext(AppContext);
  const [newBudget, setNewBudget] = useState({ category: '', amount: '', period: 'monthly' });

  const handleChange = (e) => {
    setNewBudget({ ...newBudget, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBudget(newBudget);
      setNewBudget({ category: '', amount: '', period: 'monthly' });
    } catch (error) {
      console.error('Failed to add budget:', error);
    }
  };

  return (
    <div className="budget-setup">
      <h2>Budget Setup</h2>
      <form onSubmit={handleSubmit} className="budget-form">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={newBudget.category}
            onChange={handleChange}
            placeholder="e.g., Groceries"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={newBudget.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="period">Period</label>
          <select id="period" name="period" value={newBudget.period} onChange={handleChange}>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">Add Budget</button>
      </form>
      <div className="current-budgets">
        <h3>Current Budgets</h3>
        {budgets.length > 0 ? (
          <ul className="budget-list">
            {budgets.map((budget) => (
              <li key={budget._id} className="budget-item">
                <span className="budget-category">{budget.category}</span>
                <span className="budget-amount">${budget.amount}</span>
                <span className="budget-period">{budget.period}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-budgets">No budgets set yet.</p>
        )}
      </div>
    </div>
  );
};

export default BudgetSetup;
