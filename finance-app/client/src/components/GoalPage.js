// src/components/GoalPage.js
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import GoalForm from './GoalForm';
import './GoalPage.css';

const GoalPage = () => {
  const { goals, fetchGoals, deleteGoal } = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const fetchGoalsCallback = useCallback(() => {
    fetchGoals();
  }, [fetchGoals]);

  useEffect(() => {
    fetchGoalsCallback();
  }, [fetchGoalsCallback]);

  const openForm = (goal = null) => {
    setSelectedGoal(goal);
    setShowForm(true);
  };

  const closeForm = () => {
    setSelectedGoal(null);
    setShowForm(false);
  };

  const handleDeleteGoal = async (id) => {
    try {
      await deleteGoal(id);
      // Optionally, you can refetch goals here to ensure the list is up-to-date
      // fetchGoalsCallback();
    } catch (error) {
      console.error('Failed to delete goal:', error);
      // Optionally, you can set an error state and display it to the user
    }
  };

  return (
    <div className="goal-page">
      <h1>Goals</h1>
      <button onClick={() => openForm()}>Create New Goal</button>
      <div className="goal-list">
        {goals.map(goal => (
          <div key={goal._id} className="goal-item">
            <h3>{goal.name}</h3>
            <p>Category: {goal.category ? goal.category.name : 'N/A'}</p>
            <p>Target Amount: ${goal.targetAmount}</p>
            <p>Current Amount: ${goal.currentAmount}</p>
            <p>Remaining: ${goal.targetAmount - goal.currentAmount}</p>
            <p>Start Date: {new Date(goal.startDate).toLocaleDateString()}</p>
            <p>Target Date: {new Date(goal.targetDate).toLocaleDateString()}</p>
            <button onClick={() => openForm(goal)}>Edit</button>
            <button onClick={() => handleDeleteGoal(goal._id)}>Delete</button>
          </div>
        ))}
      </div>
      {showForm && (
        <GoalForm goal={selectedGoal} onClose={closeForm} />
      )}
    </div>
  );
};

export default GoalPage;
