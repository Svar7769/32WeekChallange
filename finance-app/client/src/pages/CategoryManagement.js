// src/components/CategoryManagement.js
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './CategoryManagement.css';

const CategoryManagement = () => {
  const { categories, addCategory } = useContext(AppContext);
  const [newCategory, setNewCategory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCategory({ name: newCategory });
      setNewCategory('');
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  return (
    <div className="category-management">
      <h2>Category Management</h2>
      <form onSubmit={handleSubmit} className="category-form">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New Category"
          required
          className="category-input"
        />
        <button type="submit" className="add-button">Add Category</button>
      </form>
      <div className="current-categories">
        <h3>Current Categories</h3>
        {categories.length > 0 ? (
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category._id} className="category-item">{category.name}</li>
            ))}
          </ul>
        ) : (
          <p className="no-categories">No categories added yet.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;
