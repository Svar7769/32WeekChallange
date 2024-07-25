import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AppContext = createContext();

const addTransaction = async (transactionData, token) => {
  try {
    const response = await axios.post('http://localhost:5000/api/transactions', transactionData, {
      headers: { 'x-auth-token': token }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
      fetchTransactions(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/me', {
        headers: { 'x-auth-token': token }
      });
      setUser(response.data);
    } catch (error) {
      setError('Failed to fetch user data');
      localStorage.removeItem('token');
    }
    setLoading(false);
  };

  const fetchTransactions = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/transactions', {
        headers: { 'x-auth-token': token }
      });
      setTransactions(response.data);
    } catch (error) {
      setError('Failed to fetch transactions');
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', credentials);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      fetchTransactions(response.data.token);
      setError(null);
    } catch (error) {
      setError(error.response.data.msg || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', userData);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setError(null);
    } catch (error) {
      setError(error.response.data.msg || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setTransactions([]);
    setError(null);
  };

  const handleAddTransaction = async (transactionData) => {
    const token = localStorage.getItem('token');
    const newTransaction = await addTransaction(transactionData, token);
    setTransactions([...transactions, newTransaction]);
  };

  return (
    <AppContext.Provider value={{
      user,
      transactions,
      loading,
      error,
      login,
      register,
      logout,
      addTransaction: handleAddTransaction
    }}>
      {children}
    </AppContext.Provider>
  );
};
