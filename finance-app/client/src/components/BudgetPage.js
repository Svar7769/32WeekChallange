// src/components/BudgetPage.js
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import BudgetForm from './BudgetForm';
import './BudgetPage.css'; // Import CSS for styling

const BudgetPage = () => {
  const { budgets, fetchBudgets, deleteBudget } = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const fetchBudgetsCallback = useCallback(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  useEffect(() => {
    fetchBudgetsCallback();
  }, [fetchBudgetsCallback]);

  const openForm = (budget = null) => {
    setSelectedBudget(budget);
    setShowForm(true);
  };

  const closeForm = () => {
    setSelectedBudget(null);
    setShowForm(false);
  };

  const handleDeleteBudget = async (id) => {
    try {
      await deleteBudget(id);
      // Optionally, you can refetch budgets here to ensure the list is up-to-date
      // fetchBudgetsCallback();
    } catch (error) {
      console.error('Failed to delete budget:', error);
      // Optionally, you can set an error state and display it to the user
    }
  };

  return (
    <div className="budget-page">
      <h1>Budgets</h1>
      <button onClick={() => openForm()}>Create New Budget</button>
      <div className="budget-list">
        {budgets.map(budget => (
          <div key={budget._id} className="budget-item">
            <h3>{budget.name}</h3>
            <p>Category: {budget.category ? budget.category.name : 'N/A'}</p>
            <p>Amount: ${budget.amount}</p>
            <p>Spent: ${budget.spent || 0}</p>
            <p>Remaining: ${budget.amount - (budget.spent || 0)}</p>
            <p>Start Date: {new Date(budget.startDate).toLocaleDateString()}</p>
            <p>End Date: {new Date(budget.endDate).toLocaleDateString()}</p>
            <p>Transactions: {budget.transactions ? budget.transactions.length : 0}</p>
            <button onClick={() => openForm(budget)}>Edit</button>
            <button onClick={() => handleDeleteBudget(budget._id)}>Delete</button>
          </div>
        ))}
      </div>
      {showForm && (
        <BudgetForm budget={selectedBudget} onClose={closeForm} />
      )}
    </div>
  );
};

export default BudgetPage;
