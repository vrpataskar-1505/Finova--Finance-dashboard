// src/components/Dashboard.jsx
import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { Card, CardHeader, Badge, formatINR, formatINRFull } from './UI';
import { useSummary, useMonthlyData, useCategoryBreakdown } from '../hooks/useTransactions';
import { useApp } from '../context/AppContext';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../data/transactions';

function StatCard({ label, value, sub, positive, color, icon }) {
  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '16px 18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.7px', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 26, fontFamily: 'Syne, sans-serif', fontWeight: 700, color: color || 'var(--t1)', lineHeight: 1 }}>
        {formatINRFull(value)}
      </div>
      {sub && (
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--t2)' }}>{sub}</div>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg3)', border: '1px solid var(--border2)',
      borderRadius: 10, padding: '10px 14px', fontSize: 12,
    }}>
      <div style={{ color: 'var(--t2)', marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: 'inline-block' }} />
          {p.name}: {formatINRFull(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { state } = useApp();
  const { role } = state;
  const { income, expenses, balance, savingsRate } = useSummary();
  const monthly = useMonthlyData();
  const catData = useCategoryBreakdown();
  const topCats = catData.slice(0, 5);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Role banner */}
      {role === 'admin' && (
        <div style={{
          background: 'var(--amber-dim)', border: '1px solid var(--amber)',
          borderRadius: 'var(--radius)', padding: '8px 16px',
          display: 'flex', alignItems: 'center', gap: 8, fontSize: 12,
          color: 'var(--amber)',
        }}>
          <span>👑</span>
          <strong>Admin Mode:</strong> You can add, edit, and delete transactions from the Transactions tab.
        </div>
      )}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <StatCard label="Total Balance" value={balance} icon="💰"
          color={balance >= 0 ? 'var(--green)' : 'var(--red)'}
          sub={`Savings rate: ${savingsRate.toFixed(1)}%`} />
        <StatCard label="Total Income" value={income} icon="📈"
          color="var(--sky)" sub="All time income" />
        <StatCard label="Total Expenses" value={expenses} icon="📉"
          color="var(--red)" sub="All time spending" />
        <StatCard label="Avg Monthly Save" icon="🏦"
          value={monthly.length ? Math.round(monthly.reduce((s,m)=>s+m.balance,0)/monthly.length) : 0}
          color="var(--purple)" sub={`Across ${monthly.length} months`} />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 14 }}>
        {/* Area chart — balance trend */}
        <Card>
          <CardHeader title="Balance Trend — Monthly Overview" />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthly} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: 'var(--t3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--t3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" name="Income" stroke="#38bdf8" strokeWidth={2} fill="url(#incGrad)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f87171" strokeWidth={2} fill="url(#expGrad)" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            {[['Income', '#38bdf8'], ['Expenses', '#f87171']].map(([l, c]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--t2)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: 'inline-block' }} />
                {l}
              </div>
            ))}
          </div>
        </Card>

        {/* Pie chart — spending breakdown */}
        <Card>
          <CardHeader title="Spending by Category" />
          {topCats.length === 0 ? (
            <div style={{ color: 'var(--t3)', textAlign: 'center', padding: '40px 0' }}>No expense data</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={topCats} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                    dataKey="amount" nameKey="name" paddingAngle={3}>
                    {topCats.map((c, i) => (
                      <Cell key={i} fill={CATEGORY_COLORS[c.name] || '#888'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatINRFull(v)} contentStyle={{
                    background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10,
                    fontSize: 12, color: 'var(--t1)',
                  }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 4 }}>
                {topCats.map(c => (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>{CATEGORY_ICONS[c.name] || '•'}</span>
                    <span style={{ flex: 1, fontSize: 11, color: 'var(--t2)' }}>{c.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: CATEGORY_COLORS[c.name] || 'var(--t1)' }}>
                      {c.pct.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Bar chart — monthly comparison */}
      <Card>
        <CardHeader title="Income vs Expenses — Monthly Comparison" />
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthly} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: 'var(--t3)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--t3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income" name="Income" fill="#38bdf8" radius={[4,4,0,0]} maxBarSize={36} />
            <Bar dataKey="expenses" name="Expenses" fill="#f87171" radius={[4,4,0,0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
