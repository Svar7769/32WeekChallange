// src/components/BudgetForm.js
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const BudgetForm = ({ budget, onClose }) => {
  const { addBudget, updateBudget } = useContext(AppContext);
  const [formData, setFormData] = useState(
    budget || { category: '', amount: '', period: 'monthly' }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (budget) {
      updateBudget(budget._id, formData);
    } else {
      addBudget(formData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{budget ? 'Edit Budget' : 'Create New Budget'}</h2>
      <div>
        <label htmlFor="category">Category</label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
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
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="period">Period</label>
        <select
          id="period"
          name="period"
          value={formData.period}
          onChange={handleChange}
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <button type="submit">{budget ? 'Update' : 'Create'} Budget</button>
    </form>
  );
};

export default BudgetForm;
