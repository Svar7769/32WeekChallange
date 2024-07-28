import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axiosInstance from '../utils/axiosInstance';
import './TransactionForm.css';

const TransactionForm = () => {
  const { addTransaction } = useContext(AppContext);

  const [transaction, setTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().substr(0, 10)
  });

  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching categories...');
        const response = await axiosInstance.get('/categories');
        console.log('Categories fetched successfully:', response.data);
        setCategories(response.data);
        if (response.data.length > 0) {
          setTransaction(prev => ({ ...prev, category: response.data[0]._id }));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    console.log('Categories updated:', categories);
  }, [categories]);

  const handleChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addTransaction(transaction);
      setTransaction({
        description: '',
        amount: '',
        type: 'expense',
        category: categories.length > 0 ? categories[0]._id : '',
        date: new Date().toISOString().substr(0, 10)
      });
    } catch (err) {
      setError('Failed to add transaction');
      console.error('Error adding transaction:', err);
    }
  };

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  console.log('Rendering categories:', categories);

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
          <select id="type" name="type" value={transaction.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={transaction.category} onChange={handleChange}>
            {categories.length > 0 ? (
              categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))
            ) : (
              <option value="">No categories available</option>
            )}
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
