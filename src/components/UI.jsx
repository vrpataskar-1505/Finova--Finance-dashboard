// src/components/UI.jsx
import React from 'react';

export function Card({ children, style, className = '' }) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 20px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{title}</h3>
      {right && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{right}</div>}
    </div>
  );
}

export function Badge({ children, color = 'var(--lime)', bg = 'var(--lime-dim)' }) {
  return (
    <span style={{
      color, background: bg,
      padding: '2px 8px', borderRadius: 8,
      fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center',
    }}>
      {children}
    </span>
  );
}

export function Chip({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 12px',
        borderRadius: 8,
        border: active ? '1px solid var(--lime)' : '1px solid var(--border)',
        background: active ? 'var(--lime-dim)' : 'var(--bg3)',
        color: active ? 'var(--lime)' : 'var(--t2)',
        fontSize: 11,
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'all .15s',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

export function Input({ style, ...props }) {
  return (
    <input
      style={{
        background: 'var(--bg3)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        color: 'var(--t1)',
        padding: '7px 12px',
        outline: 'none',
        fontSize: 12,
        width: '100%',
        transition: 'border-color .15s',
        ...style,
      }}
      onFocus={e => e.target.style.borderColor = 'var(--border2)'}
      onBlur={e => e.target.style.borderColor = 'var(--border)'}
      {...props}
    />
  );
}

export function Select({ style, ...props }) {
  return (
    <select
      style={{
        background: 'var(--bg3)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        color: 'var(--t1)',
        padding: '7px 10px',
        outline: 'none',
        fontSize: 12,
        cursor: 'pointer',
        ...style,
      }}
      {...props}
    />
  );
}

export function Button({ children, variant = 'secondary', style, ...props }) {
  const styles = {
    primary: {
      background: 'var(--lime)', color: '#0b0f1a',
      border: 'none', fontWeight: 700,
    },
    secondary: {
      background: 'var(--bg3)', color: 'var(--t2)',
      border: '1px solid var(--border)',
    },
    danger: {
      background: 'var(--red-dim)', color: 'var(--red)',
      border: '1px solid var(--red)',
    },
    ghost: {
      background: 'transparent', color: 'var(--t2)',
      border: 'none',
    },
  };
  return (
    <button
      style={{
        padding: '7px 14px',
        borderRadius: 'var(--radius)',
        fontSize: 12,
        cursor: 'pointer',
        transition: 'all .15s',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        ...styles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function EmptyState({ message = 'No data found', sub = '' }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--t3)' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>{message}</div>
      {sub && <div style={{ fontSize: 12 }}>{sub}</div>}
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="fade-in"
        style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border2)',
          borderRadius: 'var(--radius-lg)',
          padding: 24,
          width: '100%',
          maxWidth: 480,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function formatINR(n) {
  const abs = Math.abs(n);
  if (abs >= 100000) return `₹${(abs / 100000).toFixed(1)}L`;
  if (abs >= 1000)   return `₹${(abs / 1000).toFixed(1)}k`;
  return `₹${abs.toLocaleString('en-IN')}`;
}

export function formatINRFull(n) {
  return `₹${Math.abs(n).toLocaleString('en-IN')}`;
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
