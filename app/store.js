// Maple & Main — store: state, persistence and the sums the views show.
// State lives in localStorage under one key, so the family's edits survive
// a reload. Everything is computed from the transaction list; there is no
// hidden second copy of a total anywhere. Amounts are rounded to cents
// whenever they are summed, so $0.10 + $0.20 never shows as $0.30000000004.

const STORE_KEY = 'maple-main-budget-v1';

// A deep copy of the seed data, so the live state never mutates DATA.
function seedState() {
  return JSON.parse(JSON.stringify(DATA));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions)) return seedState();
    return parsed;
  } catch (err) {
    return seedState();
  }
}

function saveState(state) {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function resetState() {
  const fresh = seedState();
  saveState(fresh);
  return fresh;
}

// ---- money ---------------------------------------------------------------

function cents(n) {
  return Math.round(n * 100) / 100;
}

function fmt(n) {
  const v = cents(n);
  const sign = v < 0 ? '-' : '';
  const abs = Math.abs(v);
  const whole = Math.floor(abs).toString();
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const frac = (Math.round(abs * 100) % 100).toString().padStart(2, '0');
  return sign + '$' + grouped + '.' + frac;
}

function fmtSigned(n) {
  return (n < 0 ? '-' : '+') + fmt(Math.abs(n));
}

function monthLabel(month) {
  const parts = month.split('-');
  const names = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return names[Number(parts[1]) - 1] + ' ' + parts[0];
}

function shortMonth(month) {
  return monthLabel(month).slice(0, 3) + ' ' + month.slice(0, 4);
}

// ---- ids -----------------------------------------------------------------
// Deterministic ids: the next free number after the largest in use.
// No clock, no randomness — the same seed always yields the same ids.

function nextId(state, prefix, list) {
  let max = 0;
  for (const item of list) {
    const m = /^([a-z]+)(\d+)$/.exec(item.id || '');
    if (m && m[1] === prefix) max = Math.max(max, Number(m[2]));
  }
  return prefix + String(max + 1).padStart(3, '0');
}

// ---- lookups -------------------------------------------------------------

function categoryById(id) {
  return DATA.categories.find((c) => c.id === id) || null;
}

function expenseCategories() {
  return DATA.categories.filter((c) => c.kind === 'expense');
}

function incomeCategories() {
  return DATA.categories.filter((c) => c.kind === 'income');
}

function monthTx(state, month) {
  return state.transactions.filter((t) => t.date.slice(0, 7) === month);
}

// The newest n transactions of a month, newest first (the dashboard list).
function recentTransactions(state, month, n) {
  return monthTx(state, month)
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, n);
}

function monthTotals(state, month) {
  const rows = monthTx(state, month);
  let income = 0;
  let expense = 0;
  for (const t of rows) {
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  }
  income = cents(income);
  expense = cents(expense);
  return { income, expense, balance: cents(income - expense),
    rate: income > 0 ? Math.round(((income - expense) / income) * 100) : 0 };
}

function categoryTotals(state, month) {
  const out = {};
  for (const t of monthTx(state, month)) {
    if (t.type !== 'expense') continue;
    out[t.category] = cents((out[t.category] || 0) + t.amount);
  }
  return out;
}

function budgetFor(state, month) {
  return state.budgets[month] || {};
}

function totalBudget(state, month) {
  return cents(Object.values(budgetFor(state, month)).reduce((a, b) => a + b, 0));
}

function unpaidBills(state) {
  return state.bills.filter((b) => !b.paid);
}

function unpaidTotal(state) {
  return cents(unpaidBills(state).reduce((a, b) => a + b.amount, 0));
}

function goalProgress(goal) {
  const pct = goal.target > 0 ? Math.min(100, Math.round((goal.saved / goal.target) * 100)) : 0;
  const left = cents(Math.max(0, goal.target - goal.saved));
  return { pct, left };
}

// Months from the current month (Nov 2026) to the goal's target date,
// counting the target month itself. Used for "save $X a month".
function monthlyNeed(goal, currentMonth) {
  const left = cents(Math.max(0, goal.target - goal.saved));
  if (left <= 0) return 0;
  const from = currentMonth.split('-').map(Number);
  const to = goal.targetDate.split('-').map(Number);
  let months = (to[0] - from[0]) * 12 + (to[1] - from[1]) + 1;
  if (months < 1) months = 1;
  return cents(left / months);
}

// ---- mutations -----------------------------------------------------------
// Every mutation saves immediately and returns the updated state.

function addTransaction(state, tx) {
  const row = {
    id: nextId(state, 't', state.transactions),
    date: tx.date,
    type: tx.type,
    category: tx.category,
    payee: tx.payee.trim(),
    amount: cents(Math.abs(Number(tx.amount) || 0)),
    note: (tx.note || '').trim(),
  };
  state.transactions.push(row);
  state.transactions.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  saveState(state);
  return row;
}

function updateTransaction(state, id, tx) {
  const row = state.transactions.find((t) => t.id === id);
  if (!row) return null;
  row.date = tx.date;
  row.type = tx.type;
  row.category = tx.category;
  row.payee = tx.payee.trim();
  row.amount = cents(Math.abs(Number(tx.amount) || 0));
  row.note = (tx.note || '').trim();
  state.transactions.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  saveState(state);
  return row;
}

function deleteTransaction(state, id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  saveState(state);
}

function setBudget(state, month, categoryId, amount) {
  if (!state.budgets[month]) state.budgets[month] = {};
  state.budgets[month][categoryId] = cents(Math.max(0, Number(amount) || 0));
  saveState(state);
}

function toggleBill(state, id) {
  const bill = state.bills.find((b) => b.id === id);
  if (bill) bill.paid = !bill.paid;
  saveState(state);
  return bill;
}

function addBill(state, bill) {
  const row = {
    id: nextId(state, 'b', state.bills),
    name: bill.name.trim(),
    payee: bill.payee.trim(),
    amount: cents(Math.abs(Number(bill.amount) || 0)),
    dueDay: Math.min(28, Math.max(1, Number(bill.dueDay) || 1)),
    paid: false,
  };
  state.bills.push(row);
  state.bills.sort((a, b) => a.dueDay - b.dueDay);
  saveState(state);
  return row;
}

function deleteBill(state, id) {
  state.bills = state.bills.filter((b) => b.id !== id);
  saveState(state);
}

function contributeGoal(state, id, amount) {
  const goal = state.goals.find((g) => g.id === id);
  if (!goal) return null;
  goal.saved = cents(goal.saved + Math.abs(Number(amount) || 0));
  saveState(state);
  return goal;
}

function updateGoal(state, id, patch) {
  const goal = state.goals.find((g) => g.id === id);
  if (!goal) return null;
  if (patch.name !== undefined) goal.name = patch.name.trim();
  if (patch.target !== undefined) goal.target = cents(Math.max(0, Number(patch.target) || 0));
  if (patch.targetDate !== undefined) goal.targetDate = patch.targetDate;
  if (patch.note !== undefined) goal.note = (patch.note || '').trim();
  saveState(state);
  return goal;
}

function addGoal(state, goal) {
  const row = {
    id: nextId(state, 'g', state.goals),
    name: goal.name.trim(),
    target: cents(Math.abs(Number(goal.target) || 0)),
    saved: 0,
    targetDate: goal.targetDate,
    note: (goal.note || '').trim(),
  };
  state.goals.push(row);
  saveState(state);
  return row;
}

function deleteGoal(state, id) {
  state.goals = state.goals.filter((g) => g.id !== id);
  saveState(state);
}

function clearAll(state) {
  state.transactions = [];
  state.budgets = {};
  state.bills = [];
  state.goals = [];
  saveState(state);
}
