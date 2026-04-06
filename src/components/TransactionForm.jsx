// src/components/TransactionForm.jsx
import React, { useState } from 'react';
import { Modal, Input, Select, Button } from './UI';
import { CATEGORIES } from '../data/transactions';
import { useApp } from '../context/AppContext';

const empty = {
  name: '', amount: '', category: 'Food & Dining',
  type: 'expense', date: new Date().toISOString().slice(0, 10), note: '',
};

export function TransactionForm({ open, onClose, existing }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState(existing ? {
    ...existing, amount: Math.abs(existing.amount).toString(),
  } : empty);
  const [errors, setErrors] = useState({});

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      errs.amount = 'Enter a valid amount';
    if (!form.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const amt = Number(form.amount) * (form.type === 'expense' ? -1 : 1);
    if (existing) {
      dispatch({ type: 'EDIT_TRANSACTION', payload: { ...form, amount: amt, id: existing.id } });
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: {
        ...form, amount: amt,
        id: `tx-${Date.now()}`,
      }});
    }
    onClose();
  }

  const field = (label, key, el) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, color: 'var(--t3)', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>
        {label}
      </label>
      {el}
      {errors[key] && <div style={{ color: 'var(--red)', fontSize: 11, marginTop: 4 }}>{errors[key]}</div>}
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title={existing ? 'Edit Transaction' : 'Add Transaction'}>
      {field('Transaction Name', 'name',
        <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Grocery Store" />
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {field('Amount (₹)', 'amount',
          <Input type="number" min="0" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0" />
        )}
        {field('Type', 'type',
          <Select value={form.type} onChange={e => set('type', e.target.value)} style={{ width: '100%' }}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {field('Category', 'category',
          <Select value={form.category} onChange={e => set('category', e.target.value)} style={{ width: '100%' }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        )}
        {field('Date', 'date',
          <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
        )}
      </div>
      {field('Note (optional)', 'note',
        <Input value={form.note} onChange={e => set('note', e.target.value)} placeholder="Any additional note..." />
      )}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>
          {existing ? 'Save Changes' : '+ Add Transaction'}
        </Button>
      </div>
    </Modal>
  );
}
