// src/components/Insights.jsx
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';
import { Card, CardHeader, Badge, formatINRFull } from './UI';
import { useSummary, useMonthlyData, useCategoryBreakdown } from '../hooks/useTransactions';
import { useApp } from '../context/AppContext';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../data/transactions';

function InsightCard({ icon, title, value, sub, color = 'var(--lime)' }) {
  return (
    <div style={{
      background: 'var(--bg3)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '16px 18px',
    }}>
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 11, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.7px', fontWeight: 600, marginBottom: 6 }}>{title}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.5 }}>{sub}</div>
    </div>
  );
}

export default function Insights() {
  const { state } = useApp();
  const { income, expenses, balance, savingsRate } = useSummary();
  const monthly = useMonthlyData();
  const catBreakdown = useCategoryBreakdown();

  const topCat = catBreakdown[0];
  const lastTwo = monthly.slice(-2);
  const momChange = lastTwo.length === 2
    ? ((lastTwo[1].expenses - lastTwo[0].expenses) / (lastTwo[0].expenses || 1)) * 100
    : 0;
  const incomeChange = lastTwo.length === 2
    ? ((lastTwo[1].income - lastTwo[0].income) / (lastTwo[0].income || 1)) * 100
    : 0;

  const maxMonth = monthly.reduce((a, b) => (a.income > b.income ? a : b), monthly[0] || {});
  const minMonth = monthly.reduce((a, b) => (a.expenses < b.expenses ? a : b), monthly[0] || {});

  // Net savings per month
  const savingsData = monthly.map(m => ({
    label: m.label,
    savings: m.balance,
  }));

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Key Insights Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <InsightCard
          icon="🔥"
          title="Highest Spending Category"
          value={topCat ? topCat.name : 'N/A'}
          sub={topCat ? `${formatINRFull(topCat.amount)} total — ${topCat.pct.toFixed(0)}% of all expenses` : 'No data'}
          color={topCat ? CATEGORY_COLORS[topCat.name] : 'var(--red)'}
        />
        <InsightCard
          icon={momChange > 0 ? '📈' : '📉'}
          title="Expense Change (MoM)"
          value={`${momChange > 0 ? '+' : ''}${momChange.toFixed(1)}%`}
          sub={lastTwo.length === 2
            ? `${lastTwo[0].label} → ${lastTwo[1].label}: ${formatINRFull(lastTwo[0].expenses)} → ${formatINRFull(lastTwo[1].expenses)}`
            : 'Not enough data'}
          color={momChange > 0 ? 'var(--red)' : 'var(--green)'}
        />
        <InsightCard
          icon="💰"
          title="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          sub={savingsRate >= 20 ? '✅ Excellent! Above 20% target' : savingsRate >= 10 ? '⚠️ Moderate — aim for 20%+' : '❌ Low — review your spending'}
          color={savingsRate >= 20 ? 'var(--green)' : savingsRate >= 10 ? 'var(--amber)' : 'var(--red)'}
        />
        <InsightCard
          icon="📅"
          title="Best Income Month"
          value={maxMonth?.label || 'N/A'}
          sub={maxMonth ? `${formatINRFull(maxMonth.income)} earned` : 'No data'}
          color="var(--sky)"
        />
      </div>

      {/* Monthly net savings chart */}
      <Card>
        <CardHeader title="Monthly Net Savings" />
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={savingsData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: 'var(--t3)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--t3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
            <Tooltip
              formatter={v => formatINRFull(v)}
              contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10, fontSize: 12, color: 'var(--t1)' }}
            />
            <Bar dataKey="savings" name="Net Savings" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {savingsData.map((s, i) => (
                <Cell key={i} fill={s.savings >= 0 ? '#4ade80' : '#f87171'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Category breakdown table */}
      <Card>
        <CardHeader title="Full Spending Breakdown by Category" />
        {catBreakdown.length === 0 ? (
          <div style={{ color: 'var(--t3)', padding: '24px 0', textAlign: 'center' }}>No expense data available</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {catBreakdown.map((c, i) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 20, fontSize: 11, color: 'var(--t3)', fontWeight: 700 }}>#{i + 1}</span>
                <span style={{ fontSize: 16 }}>{CATEGORY_ICONS[c.name] || '•'}</span>
                <span style={{ flex: 1, fontSize: 12, color: 'var(--t1)', fontWeight: 500 }}>{c.name}</span>
                <div style={{ flex: 2, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden', marginRight: 12 }}>
                  <div style={{ height: '100%', width: `${c.pct}%`, background: CATEGORY_COLORS[c.name] || '#888', borderRadius: 3, transition: 'width .6s' }} />
                </div>
                <span style={{ fontSize: 11, color: 'var(--t2)', minWidth: 36 }}>{c.pct.toFixed(0)}%</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: CATEGORY_COLORS[c.name] || 'var(--t1)', minWidth: 80, textAlign: 'right' }}>
                  {formatINRFull(c.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Smart observations */}
      <Card>
        <CardHeader title="Smart Observations" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            income > expenses
              ? { icon: '✅', text: `Your income exceeds expenses by ${formatINRFull(balance)} — you're cash flow positive.`, color: 'var(--green)' }
              : { icon: '❌', text: `Expenses exceed income by ${formatINRFull(Math.abs(balance))} — review your spending.`, color: 'var(--red)' },
            topCat && topCat.pct > 30
              ? { icon: '⚠️', text: `${topCat.name} accounts for ${topCat.pct.toFixed(0)}% of expenses — consider a budget limit.`, color: 'var(--amber)' }
              : { icon: '✅', text: 'Your spending is well distributed across categories.', color: 'var(--green)' },
            savingsRate >= 20
              ? { icon: '🎯', text: `Savings rate of ${savingsRate.toFixed(1)}% meets the 20% rule. Keep it up!`, color: 'var(--lime)' }
              : { icon: '💡', text: `Savings rate is ${savingsRate.toFixed(1)}%. Try to reach 20% by reducing discretionary spending.`, color: 'var(--sky)' },
            momChange > 15
              ? { icon: '⚠️', text: `Expenses jumped ${momChange.toFixed(0)}% this month vs last. Look for one-time spikes.`, color: 'var(--amber)' }
              : momChange < -10
              ? { icon: '✅', text: `Great job! Expenses dropped ${Math.abs(momChange).toFixed(0)}% month-over-month.`, color: 'var(--green)' }
              : { icon: '📊', text: 'Your monthly expenses are relatively stable — no major spikes detected.', color: 'var(--sky)' },
          ].map((obs, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '12px 14px', borderRadius: 'var(--radius)',
              background: 'var(--bg3)', border: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{obs.icon}</span>
              <span style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.6 }}>{obs.text}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
