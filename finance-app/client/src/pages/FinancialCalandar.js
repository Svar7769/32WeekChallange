// src/pages/FinancialCalendar.js
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './FinancialCalendar.css';

const FinancialCalendar = () => {
  const { transactions, reminders } = useContext(AppContext);

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayTransactions = transactions.filter(t => new Date(t.date).toDateString() === date.toDateString());
      const dayReminders = reminders.filter(r => new Date(r.dueDate).toDateString() === date.toDateString());
      
      return (
        <div className="tile-content">
          {dayTransactions.map((transaction, index) => (
            <div key={`t-${index}`} className={`event transaction ${transaction.type}`}>
              {transaction.description}: ${transaction.amount}
            </div>
          ))}
          {dayReminders.map((reminder, index) => (
            <div key={`r-${index}`} className="event reminder">
              {reminder.name}: ${reminder.amount}
            </div>
          ))}
        </div>
      );
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const hasTransaction = transactions.some(t => new Date(t.date).toDateString() === date.toDateString());
      const hasReminder = reminders.some(r => new Date(r.dueDate).toDateString() === date.toDateString());
      if (hasTransaction || hasReminder) {
        return 'has-events';
      }
    }
  };

  return (
    <div className="financial-calendar">
      <h2>Financial Calendar</h2>
      <Calendar 
        tileContent={tileContent} 
        tileClassName={tileClassName}
        className="custom-calendar"
      />
    </div>
  );
};

export default FinancialCalendar;
