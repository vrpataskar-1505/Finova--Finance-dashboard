// src/context/AppContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { INITIAL_TRANSACTIONS } from '../data/transactions';

const AppContext = createContext(null);

const STORAGE_KEY = 'finova_state';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      return { ...s, transactions: s.transactions || INITIAL_TRANSACTIONS };
    }
  } catch {}
  return null;
}

const initialState = loadState() || {
  role: 'viewer',           // 'viewer' | 'admin'
  darkMode: true,
  transactions: INITIAL_TRANSACTIONS,
  activeTab: 'dashboard',
  filters: {
    search: '',
    type: 'all',            // 'all' | 'income' | 'expense'
    category: 'all',
    month: 'all',
    sortBy: 'date',         // 'date' | 'amount' | 'name'
    sortDir: 'desc',        // 'asc' | 'desc'
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'SET_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'RESET_FILTERS':
      return { ...state, filters: { ...initialState.filters } };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case 'TOGGLE_DARK':
      return { ...state, darkMode: !state.darkMode };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
