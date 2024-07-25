import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Dashboard = () => {
  const { transactions } = useContext(AppContext);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieChartData = {
    labels: Object.keys(expensesByCategory),
    datasets: [{
      data: Object.values(expensesByCategory),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
      ],
    }]
  };

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toLocaleString('default', { month: 'short' });
  }).reverse();

  const monthlyData = last6Months.map(month => {
    const monthTransactions = transactions.filter(t => {
      const transactionMonth = new Date(t.date).toLocaleString('default', { month: 'short' });
      return transactionMonth === month;
    });
    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses };
  });

  const lineChartData = {
    labels: last6Months,
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map(d => d.income),
        borderColor: '#36A2EB',
        fill: false,
      },
      {
        label: 'Expenses',
        data: monthlyData.map(d => d.expenses),
        borderColor: '#FF6384',
        fill: false,
      }
    ]
  };

  return (
    <div>
      <h1>Financial Dashboard</h1>
      <div>
        <h2>Summary</h2>
        <p>Total Income: ${totalIncome.toFixed(2)}</p>
        <p>Total Expenses: ${totalExpenses.toFixed(2)}</p>
        <p>Balance: ${balance.toFixed(2)}</p>
      </div>
      <div>
        <h2>Expenses by Category</h2>
        <Pie data={pieChartData} />
      </div>
      <div>
        <h2>Income vs Expenses (Last 6 Months)</h2>
        <Line data={lineChartData} />
      </div>
    </div>
  );
};

export default Dashboard;
