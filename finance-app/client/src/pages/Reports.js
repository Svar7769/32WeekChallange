// src/pages/Reports.js
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import './Reports.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Reports = () => {
  const { transactions } = useContext(AppContext);

  const generatePieChartData = () => {
    // Generate pie chart data based on transactions
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    return {
      labels: ['Income', 'Expenses'],
      datasets: [
        {
          data: [income, expenses],
          backgroundColor: ['#36A2EB', '#FF6384'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384'],
        },
      ],
    };
  };

  const generateLineChartData = () => {
    // Generate line chart data based on transactions
    // This is a simplified example. You might want to group by months, etc.
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sortedTransactions.map(t => t.date);
    const incomeData = sortedTransactions.map(t => t.type === 'income' ? t.amount : 0);
    const expenseData = sortedTransactions.map(t => t.type === 'expense' ? t.amount : 0);

    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Expenses',
          data: expenseData,
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };
  };

  return (
    <div className="reports-container">
      <h2>Financial Reports</h2>
      <div className="chart-container">
        <div className="chart">
          <h3>Income vs Expenses</h3>
          <Pie data={generatePieChartData()} />
        </div>
        <div className="chart">
          <h3>Income and Expenses Over Time</h3>
          <Line data={generateLineChartData()} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
