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

const App = () => {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/transactions" element={<PrivateRoute><TransactionList /></PrivateRoute>} />
              <Route path="/add-transaction" element={<PrivateRoute><TransactionForm /></PrivateRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
