import React, { createContext, useState, useEffect } from 'react';
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
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get('/users/me');
      setUser(response.data);
    } catch (error) {
      setError('Failed to fetch user data');
      localStorage.removeItem('token');
    }
    setLoading(false);
  };

  const fetchTransactions = async () => {
    try {
      const response = await axiosInstance.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      setError('Failed to fetch transactions');
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await axiosInstance.get('/budgets');
      setBudgets(response.data);
    } catch (error) {
      setError('Failed to fetch budgets');
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await axiosInstance.get('/goals');
      setGoals(response.data);
    } catch (error) {
      setError('Failed to fetch goals');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      setCategories(response.data);
    } catch (error) {
      setError('Failed to fetch categories');
    }
  };

  const fetchReminders = async () => {
    try {
      const response = await axiosInstance.get('/reminders');
      setReminders(response.data);
    } catch (error) {
      setError('Failed to fetch reminders');
    }
  };

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
    } catch (error) {
      setError('Failed to add transaction');
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
      addBudget,
      addGoal,
      fetchCategories,
      addCategory,
      addReminder,
      updateBudget,
      deleteBudget,
      fetchBudgets
    }}>
      {children}
    </AppContext.Provider>
  );
};
