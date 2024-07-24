// import logo from './logo.svg';
import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard.js';
import Expenses from './components/Expenses';
import Debts from './components/Debts';
import Login from './components/Login';
import Register from './components/Register';



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Expenses" element={<Expenses />} />
          <Route path="/debts" element={<Debts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
