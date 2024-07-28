// FinancialGoals.js
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './FinancialGoals.css';

const FinancialGoals = () => {
  const { goals, addGoal } = useContext(AppContext);
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', currentAmount: '0' });

  const handleChange = (e) => {
    setNewGoal({ ...newGoal, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addGoal(newGoal);
      setNewGoal({ name: '', targetAmount: '', currentAmount: '0' });
    } catch (error) {
      console.error('Failed to add goal:', error);
    }
  };

  return (
    <div className="financial-goals">
      <h2>Financial Goals</h2>
      <form onSubmit={handleSubmit} className="goal-form">
        <div className="form-group">
          <label htmlFor="name">Goal Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newGoal.name}
            onChange={handleChange}
            placeholder="e.g., New Car"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="targetAmount">Target Amount</label>
          <input
            type="number"
            id="targetAmount"
            name="targetAmount"
            value={newGoal.targetAmount}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="currentAmount">Current Amount</label>
          <input
            type="number"
            id="currentAmount"
            name="currentAmount"
            value={newGoal.currentAmount}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
        </div>
        <button type="submit" className="submit-btn">Add Goal</button>
      </form>
      <div className="current-goals">
        <h3>Current Goals</h3>
        {goals.length > 0 ? (
          <ul className="goal-list">
            {goals.map((goal) => {
              const progress = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(2);
              return (
                <li key={goal._id} className="goal-item">
                  <div className="goal-info">
                    <span className="goal-name">{goal.name}</span>
                    <span className="goal-amount">${goal.currentAmount} / ${goal.targetAmount}</span>
                  </div>
                  <div className="goal-progress">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    <span className="progress-text">{progress}%</span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="no-goals">No goals set yet.</p>
        )}
      </div>
    </div>
  );
};

export default FinancialGoals;
