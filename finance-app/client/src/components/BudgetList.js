// src/components/BudgetList.js
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import BudgetForm from './BudgetForm';
import './BudgetList.css'; // Import the CSS file

const BudgetList = () => {
  const { budgets, fetchBudgets, deleteBudget } = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBudgets = async () => {
      setIsLoading(true);
      try {
        await fetchBudgets();
      } catch (err) {
        setError('Failed to load budgets');
        console.error('Error loading budgets:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadBudgets();
  }, [fetchBudgets]);

  const openForm = (budget = null) => {
    setSelectedBudget(budget);
    setShowForm(true);
  };

  const closeForm = () => {
    setSelectedBudget(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBudget(id);
    } catch (error) {
      console.error('Failed to delete budget:', error);
      setError('Failed to delete budget');
    }
  };

  if (isLoading) return <div>Loading budgets...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="budget-list-container">
      <h2>Budgets</h2>
      <button onClick={() => openForm()}>Create New Budget</button>
      {budgets.map(budget => (
        <div key={budget._id} className="budget-item">
          <h3>{budget.name}</h3>
          <p>Category: {budget.category ? budget.category.name : 'N/A'}</p>
          <p>Amount: ${budget.amount}</p>
          <p>Spent: ${budget.spent || 0}</p>
          <p>Remaining: ${budget.amount - (budget.spent || 0)}</p>
          <p>Start Date: {new Date(budget.startDate).toLocaleDateString()}</p>
          <p>End Date: {new Date(budget.endDate).toLocaleDateString()}</p>
          <button onClick={() => openForm(budget)}>Edit</button>
          <button className="delete" onClick={() => handleDelete(budget._id)}>Delete</button>
        </div>
      ))}
      {showForm && (
        <BudgetForm budget={selectedBudget} onClose={closeForm} />
      )}
    </div>
  );
};

export default BudgetList;
