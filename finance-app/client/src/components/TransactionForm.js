// src/components/TransactionForm.js
import React, { useState, useContext, useEffect, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import './TransactionForm.css';

const TransactionForm = () => {
  const { addTransaction, categories, budgets, goals, fetchCategories, fetchBudgets, fetchGoals } = useContext(AppContext);

  const [transaction, setTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().substr(0, 10),
    budget: '',
    goal: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (categories.length === 0) fetchCategories();
    if (budgets.length === 0) fetchBudgets();
    if (goals.length === 0) fetchGoals();
  }, [categories.length, budgets.length, goals.length, fetchCategories, fetchBudgets, fetchGoals]);

  useEffect(() => {
    if (categories.length > 0 && !transaction.category) {
      setTransaction(prev => ({ ...prev, category: categories[0]._id }));
    }
  }, [categories, transaction.category]);

  const handleChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setTransaction(prevTransaction => ({
      ...prevTransaction,
      type: newType,
      budget: newType === 'expense' ? prevTransaction.budget : '',
      goal: newType === 'income' ? prevTransaction.goal : ''
    }));
  };

  const handleBudgetChange = (e) => {
    const selectedBudgetId = e.target.value;
    const selectedBudget = budgets.find(budget => budget._id === selectedBudgetId);
    
    setTransaction(prevTransaction => ({
      ...prevTransaction,
      budget: selectedBudgetId,
      category: selectedBudget ? selectedBudget.category : prevTransaction.category
    }));
  };

  const handleGoalChange = (e) => {
    const selectedGoalId = e.target.value;
    const selectedGoal = goals.find(goal => goal._id === selectedGoalId);
    
    setTransaction(prevTransaction => ({
      ...prevTransaction,
      goal: selectedGoalId,
      category: selectedGoal ? selectedGoal.category : prevTransaction.category
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const transactionToSubmit = { ...transaction };

      if (transactionToSubmit.budget === '') {
        delete transactionToSubmit.budget;
      }

      if (transactionToSubmit.goal === '') {
        delete transactionToSubmit.goal;
      }

      await addTransaction(transactionToSubmit);
      setTransaction({
        description: '',
        amount: '',
        type: 'expense',
        category: categories.length > 0 ? categories[0]._id : '',
        date: new Date().toISOString().substr(0, 10),
        budget: '',
        goal: '',
      });
    } catch (err) {
      setError('Failed to add transaction: ' + (err.response?.data?.message || err.message));
      console.error('Error adding transaction:', err);
    }
  };

  const memoizedBudgetOptions = useMemo(() => (
    budgets.length > 0 ? (
      budgets.map(budget => (
        <option key={budget._id} value={budget._id}>{budget.name}</option>
      ))
    ) : (
      <option value="">No budgets available</option>
    )
  ), [budgets]);

  const memoizedGoalOptions = useMemo(() => (
    goals.length > 0 ? (
      goals.map(goal => (
        <option key={goal._id} value={goal._id}>{goal.name}</option>
      ))
    ) : (
      <option value="">No goals available</option>
    )
  ), [goals]);

  const memoizedCategoryOptions = useMemo(() => (
    categories.length > 0 ? (
      categories.map(category => (
        <option key={category._id} value={category._id}>{category.name}</option>
      ))
    ) : (
      <option value="">No categories available</option>
    )
  ), [categories]);

  return (
    <div className="transaction-form-container">
      <form onSubmit={handleSubmit} className="transaction-form">
        <h2>Add New Transaction</h2>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
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
        <div className="form-group">
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
        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select id="type" name="type" value={transaction.type} onChange={handleTypeChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        {transaction.type === 'expense' && (
          <div className="form-group">
            <label htmlFor="budget">Budget</label>
            <select id="budget" name="budget" value={transaction.budget} onChange={handleBudgetChange}>
              <option value="">No Budget</option>
              {memoizedBudgetOptions}
            </select>
          </div>
        )}
        {transaction.type === 'income' && (
          <div className="form-group">
            <label htmlFor="goal">Goal</label>
            <select id="goal" name="goal" value={transaction.goal} onChange={handleGoalChange}>
              <option value="">No Goal</option>
              {memoizedGoalOptions}
            </select>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={transaction.category} onChange={handleChange}>
            {memoizedCategoryOptions}
          </select>
        </div>
        <div className="form-group">
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
        <button type="submit" className="submit-btn">Add Transaction</button>
      </form>
    </div>
  );
};

export default TransactionForm;
