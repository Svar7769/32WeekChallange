// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound';
// import BudgetSetup from './pages/BudgetSetup';
// import FinancialGoals from './pages/FinancialGoals';
import Reports from './pages/Reports';
import CategoryManagement from './pages/CategoryManagement';
import ProfileSettings from './pages/ProfileSettings';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import BillReminders from './pages/BillReminders';
import FinancialCalendar from './pages/FinancialCalandar';
import ExportImport from './pages/ExportImport';
import BudgetList from './components/BudgetList';
import BudgetPage from './components/BudgetPage';
import GoalPage from './components/GoalPage'; 


const App = () => {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/transactions" element={<PrivateRoute><TransactionList /></PrivateRoute>} />
              <Route path="/add-transaction" element={<PrivateRoute><TransactionForm /></PrivateRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* <Route path="/budget-setup" element={<PrivateRoute><BudgetSetup /></PrivateRoute>} /> */}
              <Route path="/budgets" element={<PrivateRoute><BudgetPage /></PrivateRoute>} />
              <Route path="/budget" element={<PrivateRoute><BudgetList /></PrivateRoute>} />
              <Route path="/financial-goals" element={<PrivateRoute><GoalPage /></PrivateRoute>} />
              <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
              <Route path="/category-management" element={<PrivateRoute><CategoryManagement /></PrivateRoute>} />
              <Route path="/profile-settings" element={<PrivateRoute><ProfileSettings /></PrivateRoute>} />
              <Route path="/analytics-dashboard" element={<PrivateRoute><AnalyticsDashboard /></PrivateRoute>} />
              <Route path="/bill-reminders" element={<PrivateRoute><BillReminders /></PrivateRoute>} />
              <Route path="/financial-calendar" element={<PrivateRoute><FinancialCalendar /></PrivateRoute>} />
              <Route path="/export-import" element={<PrivateRoute><ExportImport /></PrivateRoute>} />
              <Route path="/goals" element={<PrivateRoute><GoalPage /></PrivateRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
