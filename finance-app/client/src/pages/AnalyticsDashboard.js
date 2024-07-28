// src/pages/AnalyticsDashboard.js
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './AnalyticsDashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard = () => {
  const { transactions } = useContext(AppContext);

  const generateSpendingTrendData = () => {
    // This is a simplified example. You should process your actual transaction data here.
    const monthlySpending = {
      'January': 0, 'February': 0, 'March': 0, 'April': 0, 'May': 0, 'June': 0,
      'July': 0, 'August': 0, 'September': 0, 'October': 0, 'November': 0, 'December': 0
    };

    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        const month = new Date(transaction.date).toLocaleString('default', { month: 'long' });
        monthlySpending[month] += transaction.amount;
      }
    });

    return {
      labels: Object.keys(monthlySpending),
      datasets: [
        {
          label: 'Monthly Spending',
          data: Object.values(monthlySpending),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Spending Trend',
      },
    },
  };

  return (
    <div className="analytics-dashboard">
      <h2>Analytics Dashboard</h2>
      <div className="chart-container">
        <div className="chart">
          <h3>Spending Trend (Line Chart)</h3>
          <Line options={options} data={generateSpendingTrendData()} />
        </div>
        <div className="chart">
          <h3>Spending Trend (Bar Chart)</h3>
          <Bar options={options} data={generateSpendingTrendData()} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
