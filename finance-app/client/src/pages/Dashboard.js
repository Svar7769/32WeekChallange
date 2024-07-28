// src/pages/Dashboard.js
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { transactions, addTransaction, user, budgets, goals } = useContext(AppContext);
  const [newTransaction, setNewTransaction] = useState({ description: '', amount: '', type: 'expense', category: '' });

  const handleChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTransaction(newTransaction);
      setNewTransaction({ description: '', amount: '', type: 'expense', category: '' });
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  const calculateBalance = () => {
    return transactions.reduce((acc, transaction) => 
      transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount, 0);
  };

  const calculateMonthlySpending = () => {
    return transactions
      .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const calculateMonthlyIncome = () => {
    return transactions
      .filter(t => t.type === 'income' && new Date(t.date).getMonth() === new Date().getMonth())
      .reduce((acc, t) => acc + t.amount, 0);
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {user ? user.name : 'User'}!</h1>
      
      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Current Balance</h3>
          <p className="balance">${calculateBalance().toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>This Month's Spending</h3>
          <p>${calculateMonthlySpending().toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>This Month's Income</h3>
          <p>${calculateMonthlyIncome().toFixed(2)}</p>
        </div>
      </div>

      <div className="quick-add-transaction">
        <h2>Quick Add Transaction</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="description"
            value={newTransaction.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
          <input
            type="number"
            name="amount"
            value={newTransaction.amount}
            onChange={handleChange}
            placeholder="Amount"
            required
          />
          <select name="type" value={newTransaction.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input
            type="text"
            name="category"
            value={newTransaction.category}
            onChange={handleChange}
            placeholder="Category"
            required
          />
          <button type="submit">Add Transaction</button>
        </form>
      </div>

      <div className="recent-transactions">
        <h2>Recent Transactions</h2>
        <ul>
          {transactions.slice(0, 5).map((transaction, index) => (
            <li key={index} className={transaction.type}>
              {transaction.description}: ${transaction.amount} ({transaction.type})
            </li>
          ))}
        </ul>
        <Link to="/transactions">View All Transactions</Link>
      </div>

      <div className="financial-overview">
        <div className="overview-section">
          <h2>Budget Overview</h2>
          {budgets.slice(0, 3).map((budget, index) => (
            <div key={index} className="budget-item">
              <p>{budget.name}</p>
              <progress value={budget.spent} max={budget.amount}></progress>
              <p>${budget.spent} / ${budget.amount}</p>
            </div>
          ))}
          <Link to="/budgets">Manage Budgets</Link>
        </div>

        <div className="overview-section">
          <h2>Financial Goals</h2>
          {goals.slice(0, 3).map((goal, index) => (
            <div key={index} className="goal-item">
              <p>{goal.name}</p>
              <progress value={goal.currentAmount} max={goal.targetAmount}></progress>
              <p>${goal.currentAmount} / ${goal.targetAmount}</p>
            </div>
          ))}
          <Link to="/goals">View All Goals</Link>
        </div>
      </div>

      <div className="quick-links">
        <Link to="/reports">View Reports</Link>
        <Link to="/profile-settings">Manage Accounts</Link>
        <Link to="/profile-settings">Settings</Link>
      </div>
    </div>
  );
};

export default Dashboard;
