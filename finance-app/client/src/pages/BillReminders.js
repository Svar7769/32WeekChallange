// src/components/BillReminders.js
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './BillReminders.css';

const BillReminders = () => {
  const { reminders, addReminder } = useContext(AppContext);
  const [newReminder, setNewReminder] = useState({ name: '', amount: '', dueDate: '' });

  const handleChange = (e) => {
    setNewReminder({ ...newReminder, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReminder(newReminder);
      setNewReminder({ name: '', amount: '', dueDate: '' });
    } catch (error) {
      console.error('Failed to add reminder:', error);
    }
  };

  return (
    <div className="bill-reminders">
      <h2>Bill Reminders</h2>
      <form onSubmit={handleSubmit} className="reminder-form">
        <div className="form-group">
          <label htmlFor="name">Bill Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newReminder.name}
            onChange={handleChange}
            placeholder="e.g., Electricity Bill"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={newReminder.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={newReminder.dueDate}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="add-button">Add Reminder</button>
      </form>
      <div className="current-reminders">
        <h3>Current Reminders</h3>
        {reminders.length > 0 ? (
          <ul className="reminder-list">
            {reminders.map((reminder) => (
              <li key={reminder._id} className="reminder-item">
                <span className="reminder-name">{reminder.name}</span>
                <span className="reminder-amount">${reminder.amount}</span>
                <span className="reminder-date">Due: {new Date(reminder.dueDate).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-reminders">No reminders set yet.</p>
        )}
      </div>
    </div>
  );
};

export default BillReminders;
