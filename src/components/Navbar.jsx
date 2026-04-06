// src/components/Navbar.jsx
import React from 'react';
import { useApp } from '../context/AppContext';

const TABS = [
  { id: 'dashboard',    label: 'Dashboard' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'insights',     label: 'Insights' },
];

export default function Navbar() {
  const { state, dispatch } = useApp();
  const { activeTab, role } = state;

  return (
    <nav style={{
      display: 'flex', alignItems: 'center',
      padding: '0 24px', height: 56,
      background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100,
      gap: 8,
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'Syne, sans-serif', fontWeight: 800,
        fontSize: 18, color: 'var(--lime)',
        marginRight: 'auto', letterSpacing: '-0.5px',
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--lime)',
          boxShadow: '0 0 8px var(--lime)',
          display: 'inline-block',
        }} />
        Finova
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2 }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => dispatch({ type: 'SET_TAB', payload: tab.id })}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === tab.id ? 'var(--bg4)' : 'transparent',
              color: activeTab === tab.id ? 'var(--t1)' : 'var(--t2)',
              fontWeight: activeTab === tab.id ? 600 : 400,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all .15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Role switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
        <span style={{ fontSize: 11, color: 'var(--t3)' }}>Role:</span>
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg3)', padding: '3px', borderRadius: 9, border: '1px solid var(--border)' }}>
          {['viewer', 'admin'].map(r => (
            <button
              key={r}
              onClick={() => dispatch({ type: 'SET_ROLE', payload: r })}
              style={{
                padding: '4px 12px',
                borderRadius: 7,
                border: 'none',
                background: role === r ? (r === 'admin' ? 'var(--amber)' : 'var(--lime)') : 'transparent',
                color: role === r ? '#0b0f1a' : 'var(--t2)',
                fontWeight: role === r ? 700 : 400,
                fontSize: 11,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all .2s',
              }}
            >
              {r === 'admin' ? '👑 Admin' : '👁 Viewer'}
            </button>
          ))}
        </div>

        {/* Avatar */}
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--sky), var(--purple))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#fff',
        }}>
          VP
        </div>
      </div>
    </nav>
  );
}
