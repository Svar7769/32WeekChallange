// src/components/BudgetList.js
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import BudgetForm from './BudgetForm';

const BudgetList = () => {
  const { budgets, deleteBudget, loading, error } = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  if (loading) return <p>Loading budgets...</p>;
  if (error) return <p>Error: {error}</p>;

  const openForm = (budget = null) => {
    setSelectedBudget(budget);
    setShowForm(true);
  };

  const closeForm = () => {
    setSelectedBudget(null);
    setShowForm(false);
  };

  return (
    <div>
      <h2>Budgets</h2>
      <button onClick={() => openForm()}>Create New Budget</button>
      {budgets.map(budget => (
        <div key={budget._id}>
          <h3>{budget.category}</h3>
          <p>Budget: ${budget.amount}</p>
          <p>Spent: ${budget.spent}</p>
          <progress value={budget.spent} max={budget.amount}></progress>
          <button onClick={() => openForm(budget)}>Edit</button>
          <button onClick={() => deleteBudget(budget._id)}>Delete</button>
        </div>
      ))}
      {showForm && (
        <BudgetForm budget={selectedBudget} onClose={closeForm} />
      )}
    </div>
  );
};

export default BudgetList;
