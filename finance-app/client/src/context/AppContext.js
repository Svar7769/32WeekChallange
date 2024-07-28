// src/context/AppContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AppContext = createContext();

const API_BASE_URL = 'https://finance-api-silk.vercel.app';

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
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
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
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser(response.data.user);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.msg || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
    setUser(null);
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    setCategories([]);
    setReminders([]);
    setError(null);
  };

  const addTransaction = async (transactionData) => {
    // Optimistically update the UI
    const tempId = Date.now().toString();
    const tempTransaction = { ...transactionData, _id: tempId };
    setTransactions(prevTransactions => [...prevTransactions, tempTransaction]);

    try {
      const response = await axiosInstance.post('/transactions', transactionData);
      // Replace the temporary transaction with the one from the server
      setTransactions(prevTransactions => 
        prevTransactions.map(t => t._id === tempId ? response.data : t)
      );

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
      // If there's an error, revert the optimistic update
      setTransactions(prevTransactions => 
        prevTransactions.filter(t => t._id !== tempId)
      );
      setError('Failed to add transaction');
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
      const transaction = transactions.find(t => t._id === id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      await axiosInstance.delete(`/transactions/${id}`);
      setTransactions(transactions.filter(transaction => transaction._id !== id));

      // Update budget spending
      if (transaction.type === 'expense' && transaction.budget) {
        const updatedBudget = await axiosInstance.patch(`/budgets/${transaction.budget}/spend`, {
          amount: -transaction.amount,
          type: 'expense'
        });
        setBudgets(budgets.map(budget => 
          budget._id === updatedBudget.data._id ? updatedBudget.data : budget
        ));
      }

      // Update goal progress if it was an income transaction
      if (transaction.type === 'income' && transaction.goal) {
        const updatedGoal = await axiosInstance.patch(`/goals/${transaction.goal}/progress`, {
          amount: -transaction.amount
        });
        setGoals(goals.map(goal => 
          goal._id === updatedGoal.data._id ? updatedGoal.data : goal
        ));
      }
    } catch (error) {
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
      fetchTransactions,
      fetchBudgets,
      fetchGoals,
      fetchCategories,
      fetchReminders,
      addCategory,
      addReminder
    }}>
      {children}
    </AppContext.Provider>
  );
};