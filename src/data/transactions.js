// src/data/transactions.js
export const CATEGORIES = [
  'Food & Dining','Housing','Transport','Entertainment',
  'Education','Healthcare','Shopping','Utilities',
  'Freelance','Business Income','Investment','Salary',
];

export const CATEGORY_COLORS = {
  'Food & Dining':    '#f59e0b',
  'Housing':          '#38bdf8',
  'Transport':        '#a3e635',
  'Entertainment':    '#f87171',
  'Education':        '#c084fc',
  'Healthcare':       '#4ade80',
  'Shopping':         '#fb923c',
  'Utilities':        '#94a3b8',
  'Freelance':        '#a3e635',
  'Business Income':  '#38bdf8',
  'Investment':       '#c084fc',
  'Salary':           '#4ade80',
};

export const CATEGORY_ICONS = {
  'Food & Dining':    '🍜',
  'Housing':          '🏠',
  'Transport':        '🚗',
  'Entertainment':    '🎬',
  'Education':        '📚',
  'Healthcare':       '💊',
  'Shopping':         '🛍️',
  'Utilities':        '⚡',
  'Freelance':        '💼',
  'Business Income':  '📈',
  'Investment':       '💹',
  'Salary':           '💰',
};

let _id = 1;
const tx = (date, name, amount, category, type, note = '') => ({
  id: `tx-${_id++}`,
  date,
  name,
  amount,
  category,
  type,   // 'income' | 'expense'
  note,
});

export const INITIAL_TRANSACTIONS = [
  // April 2026
  tx('2026-04-06','Morning Chai & Snacks',          -180,  'Food & Dining',   'expense'),
  tx('2026-04-05','Uber to Office',                  -320,  'Transport',       'expense'),
  tx('2026-04-05','Client Project — UI Redesign', 22000,  'Freelance',       'income',  'Paid via bank transfer'),
  tx('2026-04-04','Netflix Subscription',             -649,  'Entertainment',   'expense'),
  tx('2026-04-04','Electricity Bill',               -1870,  'Utilities',       'expense'),
  tx('2026-04-03','Dividend — HDFC Fund',            4200,  'Investment',      'income'),
  tx('2026-04-02','D-Mart Grocery',                 -2340,  'Food & Dining',   'expense'),
  tx('2026-04-01','Monthly Rent',                  -18000,  'Housing',         'expense'),
  tx('2026-04-01','April Salary',                   75000,  'Salary',          'income'),
  // March 2026
  tx('2026-03-28','Zomato Order',                    -450,  'Food & Dining',   'expense'),
  tx('2026-03-27','Udemy Course',                   -1299,  'Education',       'expense'),
  tx('2026-03-25','Freelance — Logo Design',         8500,  'Freelance',       'income'),
  tx('2026-03-24','Doctor Consultation',            -1500,  'Healthcare',       'expense'),
  tx('2026-03-22','Amazon Shopping',                -3200,  'Shopping',        'expense'),
  tx('2026-03-20','Bus Pass',                        -500,  'Transport',       'expense'),
  tx('2026-03-18','SIP — Nifty 50',                -5000,  'Investment',      'expense', 'Monthly SIP'),
  tx('2026-03-15','Business Consulting',            15000,  'Business Income', 'income'),
  tx('2026-03-10','Phone Bill',                      -699,  'Utilities',       'expense'),
  tx('2026-03-05','Gym Membership',                  -999,  'Healthcare',       'expense'),
  tx('2026-03-01','March Salary',                   75000,  'Salary',          'income'),
  tx('2026-03-01','Monthly Rent',                  -18000,  'Housing',         'expense'),
  // February 2026
  tx('2026-02-28','Restaurant Dinner',              -1800,  'Food & Dining',   'expense'),
  tx('2026-02-25','Freelance — React App',          30000,  'Freelance',       'income'),
  tx('2026-02-20','Ola Cab',                         -420,  'Transport',       'expense'),
  tx('2026-02-18','New Shoes',                      -2500,  'Shopping',        'expense'),
  tx('2026-02-15','Dividend — SBI MF',               3100,  'Investment',      'income'),
  tx('2026-02-12','Hotstar Subscription',            -299,  'Entertainment',   'expense'),
  tx('2026-02-10','Water Bill',                      -320,  'Utilities',       'expense'),
  tx('2026-02-08','Course Books',                    -850,  'Education',       'expense'),
  tx('2026-02-01','February Salary',                75000,  'Salary',          'income'),
  tx('2026-02-01','Monthly Rent',                  -18000,  'Housing',         'expense'),
];
