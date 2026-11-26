// Maple & Main — views: the seven pages, rendered from state.
// One delegated click/submit/change listener per page (see bindView):
// every button and form on the page does what its label says.

let txFilter = { month: '2026-11', category: 'all', q: '' };
let editingTxId = null;
let clearArmed = false;

function categoryOptions(kind, selected) {
  const list = kind === 'income' ? incomeCategories() : expenseCategories();
  return list.map((c) => '<option value="' + c.id + '"' + (c.id === selected ? ' selected' : '') + '>' + esc(c.label) + '</option>').join('');
}

function typeOptions(selected) {
  return '<option value="expense"' + (selected === 'expense' ? ' selected' : '') + '>Expense</option>' +
    '<option value="income"' + (selected === 'income' ? ' selected' : '') + '>Income</option>';
}

function txRow(t) {
  const cat = categoryById(t.category);
  const sign = t.type === 'income' ? '+' : '-';
  const cls = t.type === 'income' ? 'amt-in' : 'amt-out';
  return '<tr><td>' + esc(t.date) + '</td><td>' + esc(t.payee) + '</td>' +
    '<td><span class="cat-chip" style="border-color:' + (cat ? cat.color : '#999') + '">' + esc(cat ? cat.label : t.category) + '</span></td>' +
    '<td class="note-cell">' + esc(t.note || '') + '</td>' +
    '<td class="' + cls + '">' + sign + esc(fmt(t.amount)) + '</td>' +
    '<td class="row-actions"><button type="button" data-action="tx-edit" data-id="' + t.id + '">Edit</button>' +
    '<button type="button" class="danger" data-action="tx-delete" data-id="' + t.id + '">Delete</button></td></tr>';
}

// ---- Dashboard -----------------------------------------------------------

function viewDashboard(state) {
  const month = DATA.currentMonth;
  const totals = monthTotals(state, month);
  const byCat = categoryTotals(state, month);
  const parts = expenseCategories()
    .map((c) => ({ label: c.label, value: byCat[c.id] || 0, color: c.color }))
    .filter((p) => p.value > 0)
    .sort((a, b) => b.value - a.value);
  const over = expenseCategories()
    .map((c) => ({ cat: c, spent: byCat[c.id] || 0, budget: (budgetFor(state, month)[c.id] || 0) }))
    .filter((r) => r.budget > 0 && r.spent > r.budget);
  const recent = recentTransactions(state, month, 8);
  const due = unpaidBills(state);

  let alerts = '';
  if (over.length) {
    alerts = '<section class="card alert-card"><h2>Over budget</h2><ul>' +
      over.map((r) => '<li><strong>' + esc(r.cat.label) + '</strong> is ' + esc(fmt(cents(r.spent - r.budget))) +
        ' over its ' + esc(fmt(r.budget)) + ' budget (' + esc(fmt(r.spent)) + ' spent).</li>').join('') +
      '</ul><p class="tip">' + esc(DATA.tips[0]) + '</p></section>';
  } else {
    alerts = '<section class="card ok-card"><h2>On track</h2><p>Every category is inside its budget this month. Nice work.</p></section>';
  }

  return '<h1>' + esc(monthLabel(month)) + ' at a glance</h1>' +
    '<p class="lede">Income, spending and savings for the Rivera household — Daniel &amp; Priya, Leo and Sofia.</p>' +
    '<section class="kpis">' +
    '<div class="kpi"><span class="kpi-label">Income</span><strong class="kpi-value in">' + esc(fmt(totals.income)) + '</strong><span class="kpi-sub">4 paydays + interest</span></div>' +
    '<div class="kpi"><span class="kpi-label">Spending</span><strong class="kpi-value out">' + esc(fmt(totals.expense)) + '</strong><span class="kpi-sub">across ' + parts.length + ' categories</span></div>' +
    '<div class="kpi"><span class="kpi-label">Left over</span><strong class="kpi-value">' + esc(fmt(totals.balance)) + '</strong><span class="kpi-sub">ready to save or spend</span></div>' +
    '<div class="kpi"><span class="kpi-label">Savings rate</span><strong class="kpi-value">' + totals.rate + '%</strong><span class="kpi-sub">of income kept</span></div>' +
    '</section>' +
    '<div class="grid-2">' +
    '<section class="card"><h2>Income vs spending</h2>' + miniBarsSVG(totals.income, totals.expense) +
    '<p class="muted">November income ' + esc(fmt(totals.income)) + ' minus spending ' + esc(fmt(totals.expense)) +
    ' leaves ' + esc(fmt(totals.balance)) + ' — a ' + totals.rate + '% savings rate.</p></section>' +
    '<section class="card"><h2>Where the money went</h2>' + donutSVG(parts, 190, 'spent in November') +
    '<ul class="legend-list">' + parts.slice(0, 4).map((p) => '<li><span class="dot" style="background:' + p.color + '"></span>' +
      esc(p.label) + ' <strong>' + esc(fmt(p.value)) + '</strong></li>').join('') + '</ul></section>' +
    '</div>' +
    alerts +
    '<div class="grid-2">' +
    '<section class="card"><h2>Recent transactions</h2><table class="tx-table"><thead><tr><th>Date</th><th>Payee</th><th>Category</th><th>Amount</th></tr></thead><tbody>' +
    recent.map((t) => {
      const cat = categoryById(t.category);
      const sign = t.type === 'income' ? '+' : '-';
      return '<tr><td>' + esc(t.date) + '</td><td>' + esc(t.payee) + '</td><td>' + esc(cat ? cat.label : t.category) + '</td><td class="' + (t.type === 'income' ? 'amt-in' : 'amt-out') + '">' + sign + esc(fmt(t.amount)) + '</td></tr>';
    }).join('') +
    '</tbody></table><p><a class="btn" href="#/transactions">See all transactions</a></p></section>' +
    '<section class="card"><h2>Bills still to pay</h2>' +
    (due.length
      ? '<ul class="bill-list">' + due.map((b) => '<li><span><strong>' + esc(b.name) + '</strong> — due Nov ' + b.dueDay + '</span><strong>' + esc(fmt(b.amount)) + '</strong></li>').join('') + '</ul>' +
        '<p><strong>' + esc(fmt(unpaidTotal(state))) + '</strong> still to pay in November.</p><p><a class="btn" href="#/bills">Open bills</a></p>'
      : '<p>All November bills are paid.</p>') +
    '<h2 class="subhead">Saving toward</h2><ul class="goal-mini">' +
    state.goals.map((g) => {
      const p = goalProgress(g);
      return '<li><span>' + esc(g.name) + '</span><strong>' + p.pct + '%</strong></li>';
    }).join('') + '</ul><p><a class="btn" href="#/goals">Open goals</a></p></section>' +
    '</div>';
}

// ---- Transactions --------------------------------------------------------

function viewTransactions(state) {
  const editing = editingTxId ? state.transactions.find((t) => t.id === editingTxId) : null;
  const rows = state.transactions.filter((t) => {
    if (txFilter.month !== 'all' && t.date.slice(0, 7) !== txFilter.month) return false;
    if (txFilter.category !== 'all' && t.category !== txFilter.category) return false;
    if (txFilter.q) {
      const hay = (t.payee + ' ' + (t.note || '') + ' ' + t.category).toLowerCase();
      if (!hay.includes(txFilter.q.toLowerCase())) return false;
    }
    return true;
  });
  const inc = cents(rows.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0));
  const exp = cents(rows.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0));
  const monthOpts = ['all'].concat(DATA.months).map((m) => '<option value="' + m + '"' + (txFilter.month === m ? ' selected' : '') + '>' + (m === 'all' ? 'All months' : monthLabel(m)) + '</option>').join('');
  const catOpts = '<option value="all"' + (txFilter.category === 'all' ? ' selected' : '') + '>All categories</option>' +
    DATA.categories.map((c) => '<option value="' + c.id + '"' + (txFilter.category === c.id ? ' selected' : '') + '>' + esc(c.label) + '</option>').join('');
  const formType = editing ? editing.type : 'expense';
  const formCat = editing ? editing.category : 'groceries';

  return '<h1>Transactions</h1>' +
    '<p class="lede">Every dollar in and out. Add, edit or delete a record — the totals below update at once.</p>' +
    '<section class="card"><h2>' + (editing ? 'Edit transaction' : 'Add a transaction') + '</h2>' +
    '<form id="tx-form" class="form-grid">' +
    '<label>Type<select id="tx-type" name="type">' + typeOptions(formType) + '</select></label>' +
    '<label>Date<input id="tx-date" name="date" type="date" required value="' + (editing ? editing.date : '2026-11-27') + '"></label>' +
    '<label>Category<select id="tx-category" name="category">' + categoryOptions(formType, formCat) + '</select></label>' +
    '<label>Payee / source<input id="tx-payee" name="payee" type="text" required maxlength="80" placeholder="e.g. GreenMart" value="' + esc(editing ? editing.payee : '') + '"></label>' +
    '<label>Amount ($) <input id="tx-amount" name="amount" type="number" min="0.01" step="0.01" required placeholder="0.00" value="' + (editing ? editing.amount.toFixed(2) : '') + '"></label>' +
    '<label class="wide">Note<input id="tx-note" name="note" type="text" maxlength="120" placeholder="Optional note" value="' + esc(editing ? editing.note : '') + '"></label>' +
    '<div class="form-actions wide"><button type="submit" class="btn-primary">' + (editing ? 'Save changes' : 'Add transaction') + '</button>' +
    (editing ? '<button type="button" data-action="tx-cancel-edit">Cancel edit</button>' : '') + '</div>' +
    '</form></section>' +
    '<section class="card"><h2>Filter</h2><div class="filter-row">' +
    '<label>Month<select id="filter-month">' + monthOpts + '</select></label>' +
    '<label>Category<select id="filter-category">' + catOpts + '</select></label>' +
    '<label>Search<input id="filter-q" type="search" placeholder="Payee or note" value="' + esc(txFilter.q) + '"></label>' +
    '</div>' +
    '<p class="summary-line">Showing <strong>' + rows.length + '</strong> of ' + state.transactions.length +
    ' records — income <strong class="amt-in">+' + esc(fmt(inc)) + '</strong>, spending <strong class="amt-out">-' + esc(fmt(exp)) + '</strong>, net <strong>' + esc(fmt(cents(inc - exp))) + '</strong>.</p>' +
    (rows.length
      ? '<div class="table-wrap"><table class="tx-table"><thead><tr><th>Date</th><th>Payee</th><th>Category</th><th>Note</th><th>Amount</th><th>Actions</th></tr></thead><tbody>' +
        rows.map(txRow).join('') + '</tbody></table></div>'
      : '<p class="muted">No transactions match this filter. Try another month or clear the search.</p>') +
    '</section>';
}

// ---- Budgets -------------------------------------------------------------

function viewBudgets(state) {
  const month = DATA.currentMonth;
  const byCat = categoryTotals(state, month);
  const budgets = budgetFor(state, month);
  const totalSpent = cents(Object.values(byCat).reduce((a, b) => a + b, 0));
  const totalBud = totalBudget(state, month);
  const over = expenseCategories().filter((c) => (budgets[c.id] || 0) > 0 && (byCat[c.id] || 0) > budgets[c.id]);
  const near = expenseCategories().filter((c) => (budgets[c.id] || 0) > 0 && (byCat[c.id] || 0) <= budgets[c.id] && (byCat[c.id] || 0) / budgets[c.id] >= 0.8);

  const rows = expenseCategories().map((c) => {
    const spent = byCat[c.id] || 0;
    const bud = budgets[c.id] || 0;
    const pct = bud > 0 ? Math.min(100, Math.round((spent / bud) * 100)) : 0;
    const barCls = spent > bud ? 'bar-over' : pct >= 80 ? 'bar-near' : 'bar-ok';
    const left = cents(bud - spent);
    return '<li class="budget-row"><div class="budget-head"><span><span class="dot" style="background:' + c.color + '"></span><strong>' + esc(c.label) + '</strong></span>' +
      '<span>' + esc(fmt(spent)) + ' of ' + esc(fmt(bud)) + ' · ' + pct + '%</span></div>' +
      '<div class="progress"><div class="' + barCls + '" style="width:' + pct + '%"></div></div>' +
      '<div class="budget-foot"><span class="' + (left < 0 ? 'amt-out' : 'muted') + '">' + (left < 0 ? esc(fmt(Math.abs(left))) + ' over budget' : esc(fmt(left)) + ' left') + '</span>' +
      '<span class="budget-edit"><label>Budget $<input type="number" min="0" step="1" value="' + bud + '" data-budget-for="' + c.id + '" aria-label="Budget for ' + esc(c.label) + '"></label>' +
      '<button type="button" data-action="budget-save" data-id="' + c.id + '">Save</button></span></div></li>';
  }).join('');

  return '<h1>Budgets — ' + esc(monthLabel(month)) + '</h1>' +
    '<p class="lede">A limit for each category. Change any budget and the bars update at once.</p>' +
    '<section class="card summary-strip"><div><span class="kpi-label">Total budget</span><strong>' + esc(fmt(totalBud)) + '</strong></div>' +
    '<div><span class="kpi-label">Spent so far</span><strong>' + esc(fmt(totalSpent)) + '</strong></div>' +
    '<div><span class="kpi-label">Still to spend</span><strong>' + esc(fmt(cents(totalBud - totalSpent))) + '</strong></div></section>' +
    (over.length ? '<section class="card alert-card"><h2>Over budget</h2><p>' + over.map((c) => '<strong>' + esc(c.label) + '</strong>').join(' and ') +
      ' went over this month. ' + esc(DATA.tips[1]) + '</p></section>' : '') +
    (near.length ? '<section class="card warn-card"><h2>Getting close</h2><p>' + near.map((c) => esc(c.label)).join(', ') + ' used 80% or more of the budget — worth a look before the month ends.</p></section>' : '') +
    '<section class="card"><h2>Category budgets</h2><ul class="budget-list">' + rows + '</ul></section>' +
    '<section class="card"><h2>Ways to save</h2><ul class="tips-list">' +
    DATA.tips.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul></section>';
}

// ---- Trends --------------------------------------------------------------

function viewTrends(state) {
  const labels = DATA.months.map(shortMonth);
  const income = DATA.months.map((m) => monthTotals(state, m).income);
  const expense = DATA.months.map((m) => monthTotals(state, m).expense);
  const byCat = categoryTotals(state, DATA.currentMonth);
  const rows = expenseCategories()
    .map((c) => ({ label: c.label, value: byCat[c.id] || 0, color: c.color }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);
  const avgSpend = cents(expense.reduce((a, b) => a + b, 0) / expense.length);
  const top = rows[0] || { label: '—', value: 0 };
  const rates = DATA.months.map((m) => monthTotals(state, m).rate);
  return '<h1>Trends — Sep to Nov 2026</h1>' +
    '<p class="lede">Three months side by side: is spending drifting up, and where does it go?</p>' +
    '<section class="card"><h2>Income vs spending by month</h2>' + groupedBarsSVG(labels, income, expense) +
    '<p class="muted">Spending rose from ' + esc(fmt(expense[0])) + ' in September to ' + esc(fmt(expense[2])) + ' in November, while income stayed near ' + esc(fmt(income[2])) + '.</p></section>' +
    '<section class="kpis">' +
    '<div class="kpi"><span class="kpi-label">Average monthly spending</span><strong class="kpi-value">' + esc(fmt(avgSpend)) + '</strong><span class="kpi-sub">Sep–Nov 2026</span></div>' +
    '<div class="kpi"><span class="kpi-label">Biggest category</span><strong class="kpi-value">' + esc(top.label) + '</strong><span class="kpi-sub">' + esc(fmt(top.value)) + ' in November</span></div>' +
    '<div class="kpi"><span class="kpi-label">Savings rate trend</span><strong class="kpi-value">' + rates.join('% → ') + '%</strong><span class="kpi-sub">Sep → Oct → Nov</span></div>' +
    '</section>' +
    '<section class="card"><h2>November spending by category</h2>' + shareBarsHTML(rows) + '</section>';
}

// ---- Bills ---------------------------------------------------------------

function viewBills(state) {
  const due = unpaidTotal(state);
  const rows = state.bills.map((b) => '<li class="bill-row' + (b.paid ? ' is-paid' : '') + '"><div><strong>' + esc(b.name) + '</strong> <span class="muted">· ' + esc(b.payee) + '</span><br>' +
    '<span class="muted">Due day ' + b.dueDay + ' of each month</span></div>' +
    '<div class="bill-right"><strong>' + esc(fmt(b.amount)) + '</strong>' +
    '<button type="button" data-action="bill-toggle" data-id="' + b.id + '">' + (b.paid ? 'Mark unpaid' : 'Mark paid') + '</button>' +
    '<button type="button" class="danger" data-action="bill-delete" data-id="' + b.id + '">Delete</button></div></li>').join('');
  return '<h1>Bills</h1>' +
    '<p class="lede">The fixed costs that come back every month. Tap “Mark paid” when one is settled.</p>' +
    '<section class="card summary-strip"><div><span class="kpi-label">Still to pay in November</span><strong>' + esc(fmt(due)) + '</strong></div>' +
    '<div><span class="kpi-label">Bills paid</span><strong>' + state.bills.filter((b) => b.paid).length + ' of ' + state.bills.length + '</strong></div>' +
    '<div><span class="kpi-label">Monthly total</span><strong>' + esc(fmt(cents(state.bills.reduce((a, b) => a + b.amount, 0)))) + '</strong></div></section>' +
    '<section class="card"><h2>Monthly bills</h2><ul class="bill-list">' + rows + '</ul></section>' +
    '<section class="card"><h2>Add a bill</h2>' +
    '<form id="bill-form" class="form-grid">' +
    '<label>Name<input name="name" type="text" required maxlength="60" placeholder="e.g. Gym"></label>' +
    '<label>Payee<input name="payee" type="text" required maxlength="80" placeholder="e.g. Riverside Fitness"></label>' +
    '<label>Amount ($) <input name="amount" type="number" min="0.01" step="0.01" required placeholder="0.00"></label>' +
    '<label>Due day<input name="dueDay" type="number" min="1" max="28" required value="1"></label>' +
    '<div class="form-actions wide"><button type="submit" class="btn-primary">Add bill</button></div>' +
    '</form></section>';
}

// ---- Goals ---------------------------------------------------------------

function viewGoals(state) {
  const cards = state.goals.map((g) => {
    const p = goalProgress(g);
    const need = monthlyNeed(g, DATA.currentMonth);
    return '<article class="card goal-card"><h2>' + esc(g.name) + '</h2><p class="muted">' + esc(g.note || '') + '</p>' +
      '<div class="progress"><div class="bar-ok" style="width:' + p.pct + '%"></div></div>' +
      '<p><strong>' + esc(fmt(g.saved)) + '</strong> saved of ' + esc(fmt(g.target)) + ' · ' + p.pct + '%</p>' +
      '<p>' + esc(fmt(p.left)) + ' to go · target ' + esc(g.targetDate) + (need > 0 ? ' · save <strong>' + esc(fmt(need)) + ' a month</strong>' : ' · goal reached') + '</p>' +
      '<form class="inline-form" data-goal-add="' + g.id + '">' +
      '<label>Add savings $<input type="number" min="0.01" step="0.01" required placeholder="0.00" aria-label="Amount to add to ' + esc(g.name) + '"></label>' +
      '<button type="submit" class="btn-primary">Add to goal</button></form>' +
      '<form class="inline-form" data-goal-edit="' + g.id + '">' +
      '<label>New target $<input type="number" min="0" step="1" value="' + g.target + '" aria-label="New target for ' + esc(g.name) + '"></label>' +
      '<label>Target date<input type="date" value="' + esc(g.targetDate) + '" aria-label="Target date for ' + esc(g.name) + '"></label>' +
      '<button type="submit">Save goal</button>' +
      '<button type="button" class="danger" data-action="goal-delete" data-id="' + g.id + '">Delete goal</button></form></article>';
  }).join('');
  const totalSaved = cents(state.goals.reduce((a, g) => a + g.saved, 0));
  const totalTarget = cents(state.goals.reduce((a, g) => a + g.target, 0));
  return '<h1>Savings goals</h1>' +
    '<p class="lede">What the leftover money is for. Add savings as they come in — the monthly figure updates itself.</p>' +
    '<section class="card summary-strip"><div><span class="kpi-label">Saved across all goals</span><strong>' + esc(fmt(totalSaved)) + '</strong></div>' +
    '<div><span class="kpi-label">Combined targets</span><strong>' + esc(fmt(totalTarget)) + '</strong></div>' +
    '<div><span class="kpi-label">Still to save</span><strong>' + esc(fmt(cents(totalTarget - totalSaved))) + '</strong></div></section>' +
    '<div class="grid-2">' + cards + '</div>' +
    '<section class="card"><h2>Start a new goal</h2>' +
    '<form id="goal-form" class="form-grid">' +
    '<label>Goal name<input name="name" type="text" required maxlength="60" placeholder="e.g. Holiday fund"></label>' +
    '<label>Target ($) <input name="target" type="number" min="1" step="1" required placeholder="1000"></label>' +
    '<label>Target date<input name="targetDate" type="date" required value="2027-12-31"></label>' +
    '<label class="wide">Note<input name="note" type="text" maxlength="120" placeholder="What is it for?"></label>' +
    '<div class="form-actions wide"><button type="submit" class="btn-primary">Add goal</button></div>' +
    '</form></section>';
}

// ---- Data ----------------------------------------------------------------

function viewData(state) {
  return '<h1>Your data</h1>' +
    '<p class="lede">Everything lives in this browser only (localStorage). Nothing is uploaded anywhere.</p>' +
    '<section class="card"><h2>What is stored</h2>' +
    '<p><strong>' + state.transactions.length + '</strong> transactions, <strong>' + state.bills.length + '</strong> bills and <strong>' + state.goals.length + '</strong> savings goals, for ' + esc(DATA.household) + '.</p>' +
    '<p class="muted">The sample data covers September to November 2026. Your edits are saved on this device as you make them; clearing the browser’s site data clears the budget too.</p></section>' +
    '<section class="card"><h2>Export &amp; import</h2>' +
    '<p><button type="button" class="btn-primary" data-action="data-export">Download my data as JSON</button></p>' +
    '<p><label class="btn" for="import-file">Import a JSON file</label>' +
    '<input id="import-file" type="file" accept=".json,application/json" class="visually-hidden"></p>' +
    '<p id="import-status" class="muted" role="status"></p>' +
    '<p class="muted">Import replaces the current data. Export first if you want a backup.</p></section>' +
    '<section class="card"><h2>Start over</h2>' +
    '<p><button type="button" data-action="data-sample">Load the sample data again</button> ' +
    '<button type="button" class="danger" data-action="data-clear">' + (clearArmed ? 'Click again to confirm clearing everything' : 'Clear all data') + '</button></p>' +
    '<p class="muted">Clearing removes every transaction, bill and goal. Loading the sample data brings back the Rivera household’s September–November 2026 figures.</p></section>' +
    '<section class="card"><h2>Privacy</h2><p>Maple &amp; Main makes no network requests and sends nothing anywhere. The people and figures here are fictional sample data; replace them with your own household’s numbers and they stay on your device.</p></section>';
}

// ---- wiring --------------------------------------------------------------

function render(state) {
  const route = (location.hash || '#/').replace(/^#/, '');
  const app = document.getElementById('app');
  let html = '';
  if (route === '/' || route === '') html = viewDashboard(state);
  else if (route === '/transactions') html = viewTransactions(state);
  else if (route === '/budgets') html = viewBudgets(state);
  else if (route === '/trends') html = viewTrends(state);
  else if (route === '/bills') html = viewBills(state);
  else if (route === '/goals') html = viewGoals(state);
  else if (route === '/data') html = viewData(state);
  else html = '<h1>Page not found</h1><p class="lede">That page does not exist. <a href="#/">Back to the dashboard</a>.</p>';
  app.innerHTML = html;
  const links = document.querySelectorAll('nav a');
  links.forEach((a) => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === '#' + route || (route === '/' && href === '#/'));
  });
  window.__shotReady = true;
}

function rerender() {
  render(window.__state);
}

function bindView() {
  const app = document.getElementById('app');

  app.addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    const id = btn.getAttribute('data-id');
    const state = window.__state;
    if (action === 'tx-edit') {
      editingTxId = id;
      rerender();
      document.getElementById('tx-form').scrollIntoView();
    } else if (action === 'tx-delete') {
      deleteTransaction(state, id);
      if (editingTxId === id) editingTxId = null;
      rerender();
    } else if (action === 'tx-cancel-edit') {
      editingTxId = null;
      rerender();
    } else if (action === 'budget-save') {
      const input = app.querySelector('input[data-budget-for="' + id + '"]');
      if (input) {
        setBudget(state, DATA.currentMonth, id, input.value);
        rerender();
      }
    } else if (action === 'bill-toggle') {
      toggleBill(state, id);
      rerender();
    } else if (action === 'bill-delete') {
      deleteBill(state, id);
      rerender();
    } else if (action === 'goal-delete') {
      deleteGoal(state, id);
      rerender();
    } else if (action === 'data-export') {
      const blob = new Blob([JSON.stringify(window.__state, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'maple-main-budget.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } else if (action === 'data-sample') {
      window.__state = resetState();
      editingTxId = null;
      txFilter = { month: '2026-11', category: 'all', q: '' };
      clearArmed = false;
      rerender();
    } else if (action === 'data-clear') {
      if (!clearArmed) {
        clearArmed = true;
        rerender();
      } else {
        clearAll(window.__state);
        editingTxId = null;
        clearArmed = false;
        rerender();
      }
    }
  });

  app.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const form = ev.target;
    const state = window.__state;
    if (form.id === 'tx-form') {
      const type = form.querySelector('#tx-type').value;
      const cat = form.querySelector('#tx-category').value;
      const tx = {
        date: form.querySelector('#tx-date').value,
        type,
        category: cat,
        payee: form.querySelector('#tx-payee').value,
        amount: form.querySelector('#tx-amount').value,
        note: form.querySelector('#tx-note').value,
      };
      if (!tx.date || !tx.payee.trim() || !(Number(tx.amount) > 0)) return;
      if (editingTxId) {
        updateTransaction(state, editingTxId, tx);
        editingTxId = null;
      } else {
        addTransaction(state, tx);
      }
      // Jump the filter to the new record's month so it stays visible.
      txFilter.month = tx.date.slice(0, 7);
      txFilter.category = 'all';
      txFilter.q = '';
      rerender();
    } else if (form.id === 'bill-form') {
      const data = new FormData(form);
      addBill(state, {
        name: data.get('name'),
        payee: data.get('payee'),
        amount: data.get('amount'),
        dueDay: data.get('dueDay'),
      });
      rerender();
    } else if (form.id === 'goal-form') {
      const data = new FormData(form);
      addGoal(state, {
        name: data.get('name'),
        target: data.get('target'),
        targetDate: data.get('targetDate'),
        note: data.get('note'),
      });
      rerender();
    } else if (form.hasAttribute('data-goal-add')) {
      const gid = form.getAttribute('data-goal-add');
      const input = form.querySelector('input[type="number"]');
      if (input && Number(input.value) > 0) contributeGoal(state, gid, input.value);
      rerender();
    } else if (form.hasAttribute('data-goal-edit')) {
      const gid = form.getAttribute('data-goal-edit');
      const inputs = form.querySelectorAll('input');
      updateGoal(state, gid, { target: inputs[0].value, targetDate: inputs[1].value });
      rerender();
    }
  });

  app.addEventListener('change', (ev) => {
    const el = ev.target;
    const state = window.__state;
    if (el.id === 'tx-type') {
      const cat = document.getElementById('tx-category');
      if (cat) cat.innerHTML = categoryOptions(el.value, el.value === 'income' ? 'salary' : 'groceries');
    } else if (el.id === 'filter-month') {
      txFilter.month = el.value;
      rerender();
    } else if (el.id === 'filter-category') {
      txFilter.category = el.value;
      rerender();
    } else if (el.id === 'filter-q') {
      txFilter.q = el.value;
      rerender();
    } else if (el.id === 'import-file') {
      const file = el.files && el.files[0];
      const status = document.getElementById('import-status');
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          if (!parsed || !Array.isArray(parsed.transactions)) throw new Error('bad file');
          window.__state = parsed;
          saveState(window.__state);
          editingTxId = null;
          if (status) status.textContent = 'Imported ' + parsed.transactions.length + ' transactions.';
          rerender();
        } catch (err) {
          if (status) status.textContent = 'That file could not be imported. It must be a budget export from this site.';
        }
      };
      reader.readAsText(file);
    }
  });

  // Search-as-you-type: re-render on input, not only on change.
  app.addEventListener('input', (ev) => {
    if (ev.target.id === 'filter-q') {
      txFilter.q = ev.target.value;
      const pos = ev.target.selectionStart;
      rerender();
      const again = document.getElementById('filter-q');
      if (again) {
        again.focus();
        again.setSelectionRange(pos, pos);
      }
    }
  });
}
