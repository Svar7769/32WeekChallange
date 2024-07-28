// src/pages/ExportImport.js
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './ExportImport.css';

const ExportImport = () => {
  const { transactions } = useContext(AppContext);

  const handleExport = () => {
    const dataStr = JSON.stringify(transactions);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'transactions.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      // const importedTransactions = JSON.parse(event.target.result);
      // Add importedTransactions to your transactions state
    };
    fileReader.readAsText(e.target.files[0]);
  };

  return (
    <div className="export-import">
      <h2>Export/Import Transactions</h2>
      <div className="buttons-container">
        <button onClick={handleExport} className="export-button">Export Transactions</button>
        <input type="file" accept=".json" onChange={handleImport} className="import-input" />
      </div>
    </div>
  );
};

export default ExportImport;
