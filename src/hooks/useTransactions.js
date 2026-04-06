// src/hooks/useTransactions.js
import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export function useFilteredTransactions() {
  const { state } = useApp();
  const { transactions, filters } = state;

  return useMemo(() => {
    let result = [...transactions];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.note && t.note.toLowerCase().includes(q))
      );
    }

    // Type
    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }

    // Category
    if (filters.category !== 'all') {
      result = result.filter(t => t.category === filters.category);
    }

    // Month
    if (filters.month !== 'all') {
      result = result.filter(t => t.date.startsWith(filters.month));
    }

    // Sort
    result.sort((a, b) => {
      let av, bv;
      if (filters.sortBy === 'amount') { av = Math.abs(a.amount); bv = Math.abs(b.amount); }
      else if (filters.sortBy === 'name') { av = a.name; bv = b.name; }
      else { av = a.date; bv = b.date; }

      if (av < bv) return filters.sortDir === 'asc' ? -1 : 1;
      if (av > bv) return filters.sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, filters]);
}

export function useSummary() {
  const { state } = useApp();
  const { transactions } = state;

  return useMemo(() => {
    const income   = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
    const balance  = income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income * 100) : 0;
    return { income, expenses, balance, savingsRate };
  }, [transactions]);
}

export function useMonthlyData() {
  const { state } = useApp();
  const { transactions } = state;

  return useMemo(() => {
    const months = {};
    transactions.forEach(t => {
      const key = t.date.slice(0, 7); // YYYY-MM
      if (!months[key]) months[key] = { income: 0, expenses: 0 };
      if (t.type === 'income') months[key].income += t.amount;
      else months[key].expenses += Math.abs(t.amount);
    });

    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, v]) => ({
        month: key,
        label: new Date(key + '-01').toLocaleString('default', { month: 'short', year: '2-digit' }),
        income: v.income,
        expenses: v.expenses,
        balance: v.income - v.expenses,
      }));
  }, [transactions]);
}

export function useCategoryBreakdown() {
  const { state } = useApp();
  const { transactions } = state;

  return useMemo(() => {
    const cats = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        cats[t.category] = (cats[t.category] || 0) + Math.abs(t.amount);
      });
    const total = Object.values(cats).reduce((s, v) => s + v, 0);
    return Object.entries(cats)
      .sort(([, a], [, b]) => b - a)
      .map(([name, amount]) => ({ name, amount, pct: total > 0 ? (amount / total * 100) : 0 }));
  }, [transactions]);
}
