// src/App.jsx
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Insights from './components/Insights';

function Main() {
  const { state } = useApp();
  const { activeTab } = state;

  const pages = {
    dashboard:    <Dashboard />,
    transactions: <Transactions />,
    insights:     <Insights />,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '24px 24px',
      }}>
        {pages[activeTab] || <Dashboard />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
}
