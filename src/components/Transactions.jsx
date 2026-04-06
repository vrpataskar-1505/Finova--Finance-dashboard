// src/components/Transactions.jsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useFilteredTransactions } from '../hooks/useTransactions';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '../data/transactions';
import { Card, Chip, Input, Select, Button, Badge, EmptyState, Modal, formatINRFull, formatDate } from './UI';
import { TransactionForm } from './TransactionForm';

const MONTHS = [
  { value: 'all', label: 'All Months' },
  { value: '2026-04', label: 'Apr 2026' },
  { value: '2026-03', label: 'Mar 2026' },
  { value: '2026-02', label: 'Feb 2026' },
];

export default function Transactions() {
  const { state, dispatch } = useApp();
  const { filters, role } = state;
  const filtered = useFilteredTransactions();
  const isAdmin = role === 'admin';

  const [showForm, setShowForm] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  function sf(obj) { dispatch({ type: 'SET_FILTER', payload: obj }); }

  function toggleSort(field) {
    if (filters.sortBy === field) {
      sf({ sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' });
    } else {
      sf({ sortBy: field, sortDir: 'desc' });
    }
  }

  const sortIcon = (f) => filters.sortBy === f ? (filters.sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  function exportCSV() {
    const header = 'Date,Name,Category,Type,Amount,Note';
    const rows = filtered.map(t =>
      `"${t.date}","${t.name}","${t.category}","${t.type}","${t.amount}","${t.note || ''}"`
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'finova_transactions.csv';
    a.click();
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Controls */}
      <Card style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          {/* Search */}
          <Input
            placeholder="🔍  Search transactions..."
            value={filters.search}
            onChange={e => sf({ search: e.target.value })}
            style={{ flex: '1', minWidth: 180, maxWidth: 260 }}
          />

          {/* Type filter */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'income', 'expense'].map(t => (
              <Chip key={t} active={filters.type === t} onClick={() => sf({ type: t })}>
                {t === 'all' ? 'All' : t === 'income' ? '📈 Income' : '📉 Expense'}
              </Chip>
            ))}
          </div>

          {/* Category */}
          <Select value={filters.category} onChange={e => sf({ category: e.target.value })}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>

          {/* Month */}
          <Select value={filters.month} onChange={e => sf({ month: e.target.value })}>
            {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </Select>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <Button variant="secondary" onClick={() => dispatch({ type: 'RESET_FILTERS' })}>Reset</Button>
            <Button variant="secondary" onClick={exportCSV}>⬇ Export CSV</Button>
            {isAdmin && (
              <Button variant="primary" onClick={() => { setEditTx(null); setShowForm(true); }}>
                + Add
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr 140px 90px 110px 100px',
          padding: '10px 18px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg3)',
          fontSize: 10,
          fontWeight: 700,
          color: 'var(--t3)',
          textTransform: 'uppercase',
          letterSpacing: '.7px',
          gap: 8,
        }}>
          <button onClick={() => toggleSort('date')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left', fontSize: 'inherit', fontWeight: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit' }}>
            Date{sortIcon('date')}
          </button>
          <button onClick={() => toggleSort('name')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left', fontSize: 'inherit', fontWeight: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit' }}>
            Name{sortIcon('name')}
          </button>
          <span>Category</span>
          <span>Type</span>
          <button onClick={() => toggleSort('amount')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'right', fontSize: 'inherit', fontWeight: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit' }}>
            Amount{sortIcon('amount')}
          </button>
          {isAdmin && <span style={{ textAlign: 'center' }}>Actions</span>}
        </div>

        {/* Rows */}
        <div style={{ maxHeight: 480, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <EmptyState message="No transactions found" sub="Try adjusting your filters" />
          ) : (
            filtered.map(t => (
              <TxRow key={t.id} t={t} isAdmin={isAdmin}
                onEdit={() => { setEditTx(t); setShowForm(true); }}
                onDelete={() => setConfirmDelete(t)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 18px', borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'var(--bg3)', fontSize: 12, color: 'var(--t2)',
        }}>
          <span>Showing <strong style={{ color: 'var(--t1)' }}>{filtered.length}</strong> transactions</span>
          <span>
            Total:&nbsp;
            <strong style={{ color: filtered.reduce((s, t) => s + t.amount, 0) >= 0 ? 'var(--green)' : 'var(--red)' }}>
              {filtered.reduce((s, t) => s + t.amount, 0) >= 0 ? '+' : ''}
              {formatINRFull(filtered.reduce((s, t) => s + t.amount, 0))}
            </strong>
          </span>
        </div>
      </Card>

      {/* Forms & Modals */}
      {showForm && (
        <TransactionForm open={showForm} onClose={() => setShowForm(false)} existing={editTx} />
      )}

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete Transaction">
        <p style={{ color: 'var(--t2)', marginBottom: 20, fontSize: 13 }}>
          Are you sure you want to delete <strong style={{ color: 'var(--t1)' }}>"{confirmDelete?.name}"</strong>? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => {
            dispatch({ type: 'DELETE_TRANSACTION', payload: confirmDelete.id });
            setConfirmDelete(null);
          }}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}

function TxRow({ t, isAdmin, onEdit, onDelete }) {
  const color = t.type === 'income' ? 'var(--green)' : 'var(--red)';
  const catColor = CATEGORY_COLORS[t.category] || '#888';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '120px 1fr 140px 90px 110px 100px',
      padding: '11px 18px',
      borderBottom: '1px solid var(--border)',
      alignItems: 'center',
      gap: 8,
      transition: 'background .1s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ fontSize: 11, color: 'var(--t3)' }}>{formatDate(t.date)}</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--t1)' }}>{t.name}</div>
        {t.note && <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>{t.note}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 14 }}>{CATEGORY_ICONS[t.category] || '•'}</span>
        <span style={{ fontSize: 11, color: catColor }}>{t.category}</span>
      </div>
      <Badge
        color={t.type === 'income' ? 'var(--green)' : 'var(--red)'}
        bg={t.type === 'income' ? 'var(--green-dim)' : 'var(--red-dim)'}
      >
        {t.type}
      </Badge>
      <div style={{ textAlign: 'right', fontWeight: 700, fontSize: 12, color }}>
        {t.amount > 0 ? '+' : ''}{formatINRFull(t.amount)}
      </div>
      {isAdmin && (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          <Button variant="ghost" onClick={onEdit} style={{ padding: '4px 8px', fontSize: 13 }}>✏️</Button>
          <Button variant="ghost" onClick={onDelete} style={{ padding: '4px 8px', fontSize: 13 }}>🗑️</Button>
        </div>
      )}
    </div>
  );
}
