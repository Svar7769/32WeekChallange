// src/components/GoalForm.js
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import './GoalForm.css';

const GoalForm = ({ goal, onClose }) => {
  const { addGoal, updateGoal, categories, fetchCategories } = useContext(AppContext);
  const [formData, setFormData] = useState(
    goal || {
      name: '',
      targetAmount: '',
      currentAmount: 0,
      category: '',
      startDate: '',
      targetDate: '',
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
      if (goal) {
        await updateGoal(goal._id, formData);
      } else {
        await addGoal(formData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save goal:', error);
      // You might want to set an error state here and display it to the user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="goal-form-container">
      <h2>{goal ? 'Edit Goal' : 'Create New Goal'}</h2>
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
        <label htmlFor="targetAmount">Target Amount</label>
        <input
          type="number"
          id="targetAmount"
          name="targetAmount"
          value={formData.targetAmount}
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
        <label htmlFor="targetDate">Target Date</label>
        <input
          type="date"
          id="targetDate"
          name="targetDate"
          value={formData.targetDate}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">{goal ? 'Update' : 'Create'} Goal</button>
    </form>
  );
};

export default GoalForm;
