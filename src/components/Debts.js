import React, { useState } from 'react';

const Debts = () => {
  const [debts, setDebts] = useState([]);
  const [newDebt, setNewDebt] = useState({ description: '', amount: '', isOwed: true });

  const handleSubmit = (e) => {
    e.preventDefault();
    setDebts([...debts, newDebt]);
    setNewDebt({ description: '', amount: '', isOwed: true });
  };

  return (
    <div>
      <h1>Debts</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Description"
          value={newDebt.description}
          onChange={(e) => setNewDebt({...newDebt, description: e.target.value})}
        />
        <input
          type="number"
          placeholder="Amount"
          value={newDebt.amount}
          onChange={(e) => setNewDebt({...newDebt, amount: e.target.value})}
        />
        <select
          value={newDebt.isOwed}
          onChange={(e) => setNewDebt({...newDebt, isOwed: e.target.value === 'true'})}
        >
          <option value="true">I owe</option>
          <option value="false">Owed to me</option>
        </select>
        <button type="submit">Add Debt</button>
      </form>
      <ul>
        {debts.map((debt, index) => (
          <li key={index}>
            {debt.description}: ${debt.amount} ({debt.isOwed ? 'I owe' : 'Owed to me'})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Debts;
