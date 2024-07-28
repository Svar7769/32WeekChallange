// src/context/AppContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AppContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/users/me');
      setUser(response.data);
    } catch (error) {
      setError('Failed to fetch user data');
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      setError('Failed to fetch transactions');
    }
  }, []);

  const fetchBudgets = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/budgets');
      setBudgets(response.data);
    } catch (error) {
      setError('Failed to fetch budgets');
    }
  }, []);

  const fetchGoals = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/goals');
      setGoals(response.data);
    } catch (error) {
      setError('Failed to fetch goals');
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/categories');
      setCategories(response.data);
    } catch (error) {
      setError('Failed to fetch categories');
    }
  }, []);

  const fetchReminders = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/reminders');
      setReminders(response.data);
    } catch (error) {
      setError('Failed to fetch reminders');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData();
      fetchTransactions();
      fetchBudgets();
      fetchGoals();
      fetchCategories();
      fetchReminders();
    } else {
      setLoading(false);
    }
  }, [fetchUserData, fetchTransactions, fetchBudgets, fetchGoals, fetchCategories, fetchReminders]);

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post('/users/login', credentials);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      fetchTransactions();
      fetchBudgets();
      fetchGoals();
      fetchCategories();
      fetchReminders();
      setError(null);
    } catch (error) {
      setError(error.response?.data?.msg || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axiosInstance.post('/users/register', userData);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.msg || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
      localStorage.removeItem('token');
      setUser(null);
      setTransactions([]);
      setBudgets([]);
      setGoals([]);
      setCategories([]);
      setReminders([]);
      setError(null);
    };

    const addTransaction = async (transactionData) => {
    try {
      const response = await axiosInstance.post('/transactions', transactionData);
      setTransactions([...transactions, response.data]);

      // Update budget spending
      if (transactionData.type === 'expense' && transactionData.budget) {
        const updatedBudget = await axiosInstance.patch(`/budgets/${transactionData.budget}/spend`, {
          amount: transactionData.amount,
          type: transactionData.type
        });
        setBudgets(budgets.map(budget => 
          budget._id === updatedBudget.data._id ? updatedBudget.data : budget
        ));
      }

      // Update goal progress if it's an income transaction
      if (transactionData.type === 'income' && transactionData.goal) {
        const updatedGoal = await axiosInstance.patch(`/goals/${transactionData.goal}/progress`, {
          amount: transactionData.amount
        });
        setGoals(goals.map(goal => 
          goal._id === updatedGoal.data._id ? updatedGoal.data : goal
        ));
      }
    } catch (error) {
      console.error('Failed to add transaction:', error.response?.data?.message || error.message);
      setError('Failed to add transaction: ' + (error.response?.data?.message || error.message));
      throw error;
    }
  };

  const updateTransaction = async (id, transactionData) => {
    try {
      const response = await axiosInstance.patch(`/transactions/${id}`, transactionData);
      setTransactions(transactions.map(transaction => 
        transaction._id === id ? response.data : transaction
      ));
    } catch (error) {
      setError('Failed to update transaction');
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      // Fetch the transaction details before deleting
      const transactionToDelete = transactions.find(t => t._id === id);
      if (!transactionToDelete) {
        throw new Error('Transaction not found');
      }

      // Delete the transaction
      await axiosInstance.delete(`/transactions/${id}`);
      setTransactions(transactions.filter(transaction => transaction._id !== id));

      // Update budget if it's an expense transaction
      if (transactionToDelete.type === 'expense' && transactionToDelete.budget) {
        const updatedBudget = await axiosInstance.patch(`/budgets/${transactionToDelete.budget}/spend`, {
          amount: -transactionToDelete.amount, // Subtract the amount from spent
          type: 'delete'
        });
        setBudgets(budgets.map(budget => 
          budget._id === updatedBudget.data._id ? updatedBudget.data : budget
        ));
      }

      // Update goal if it's an income transaction
      if (transactionToDelete.type === 'income' && transactionToDelete.goal) {
        const updatedGoal = await axiosInstance.patch(`/goals/${transactionToDelete.goal}/progress`, {
          amount: -transactionToDelete.amount, // Subtract the amount from progress
          type: 'delete'
        });
        setGoals(goals.map(goal => 
          goal._id === updatedGoal.data._id ? updatedGoal.data : goal
        ));
      }

    } catch (error) {
      console.error('Failed to delete transaction:', error);
      setError('Failed to delete transaction');
      throw error;
    }
  };

  const addBudget = async (newBudget) => {
    try {
      const response = await axiosInstance.post('/budgets', newBudget);
      setBudgets([...budgets, response.data]);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateBudget = async (id, updatedBudget) => {
    try {
      const response = await axiosInstance.patch(`/budgets/${id}`, updatedBudget);
      setBudgets(budgets.map(budget => 
        budget._id === id ? response.data : budget
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteBudget = async (id) => {
    try {
      await axiosInstance.delete(`/budgets/${id}`);
      setBudgets(budgets.filter(budget => budget._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const addGoal = async (goalData) => {
    try {
      const response = await axiosInstance.post('/goals', goalData);
      setGoals([...goals, response.data]);
    } catch (error) {
      setError('Failed to add goal');
      throw error;
    }
  };

  const updateGoal = async (id, goalData) => {
    try {
      const response = await axiosInstance.patch(`/goals/${id}`, goalData);
      setGoals(goals.map(goal => 
        goal._id === id ? response.data : goal
      ));
    } catch (error) {
      setError('Failed to update goal');
      throw error;
    }
  };

  const deleteGoal = async (id) => {
    try {
      await axiosInstance.delete(`/goals/${id}`);
      setGoals(goals.filter(goal => goal._id !== id));
    } catch (error) {
      setError('Failed to delete goal');
      throw error;
    }
  };

  const addCategory = async (categoryData) => {
    try {
      const response = await axiosInstance.post('/categories', categoryData);
      setCategories([...categories, response.data]);
    } catch (error) {
      setError('Failed to add category');
      throw error;
    }
  };

  const addReminder = async (reminderData) => {
    try {
      const response = await axiosInstance.post('/reminders', reminderData);
      setReminders([...reminders, response.data]);
    } catch (error) {
      setError('Failed to add reminder');
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      transactions,
      budgets,
      goals,
      categories,
      reminders,
      loading,
      error,
      login,
      register,
      logout,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addBudget,
      updateBudget,
      deleteBudget,
      addGoal,
      updateGoal,
      deleteGoal,
      fetchGoals,
      fetchCategories,
      addCategory,
      addReminder,
      fetchBudgets
    }}>
      {children}
    </AppContext.Provider>
  );
};
