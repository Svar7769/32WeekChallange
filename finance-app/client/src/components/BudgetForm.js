// src/components/BudgetForm.js
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import './BudgetForm.css'; // Import the CSS file

const BudgetForm = ({ budget, onClose }) => {
  const { addBudget, updateBudget, categories, fetchCategories } = useContext(AppContext);
  const [formData, setFormData] = useState(
    budget || {
      name: '',
      amount: '',
      category: '',
      startDate: '',
      endDate: '',
      spent: 0
    }
  );

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (budget) {
        await updateBudget(budget._id, formData);
      } else {
        await addBudget(formData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save budget:', error);
      // You might want to set an error state here and display it to the user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="budget-form-container">
      <h2>{budget ? 'Edit Budget' : 'Create New Budget'}</h2>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
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
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="startDate">Start Date</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="endDate">End Date</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">{budget ? 'Update' : 'Create'} Budget</button>
    </form>
  );
};

export default BudgetForm;
