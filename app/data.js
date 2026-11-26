// Maple & Main — seed data for the Rivera household budget.
// One fictional family (Daniel & Priya Rivera, kids Leo and Sofia).
// All names are invented; all figures are the site's own sample data.
// Months: Sep–Nov 2026. November is the "current" month and its totals
// are the ones the dashboard shows: income $7,090.00, spending $3,546.18.

const DATA = {
  household: 'The Rivera Household',
  currency: 'USD',
  currentMonth: '2026-11',
  months: ['2026-09', '2026-10', '2026-11'],

  categories: [
    { id: 'housing', label: 'Housing', color: '#1f5138', kind: 'expense' },
    { id: 'groceries', label: 'Groceries', color: '#2e7d4f', kind: 'expense' },
    { id: 'dining', label: 'Dining Out', color: '#c2703d', kind: 'expense' },
    { id: 'transport', label: 'Transport', color: '#4a7fa5', kind: 'expense' },
    { id: 'utilities', label: 'Utilities', color: '#7a6aa8', kind: 'expense' },
    { id: 'kids', label: 'Kids & School', color: '#b3556e', kind: 'expense' },
    { id: 'health', label: 'Health', color: '#3d8f8a', kind: 'expense' },
    { id: 'shopping', label: 'Shopping', color: '#8a6d3b', kind: 'expense' },
    { id: 'subscriptions', label: 'Subscriptions', color: '#6b7c8d', kind: 'expense' },
    { id: 'entertainment', label: 'Entertainment', color: '#a8542e', kind: 'expense' },
    { id: 'insurance', label: 'Insurance', color: '#44546a', kind: 'expense' },
    { id: 'salary', label: 'Salary', color: '#1f5138', kind: 'income' },
    { id: 'interest', label: 'Interest', color: '#2e7d4f', kind: 'income' },
    { id: 'other-income', label: 'Other Income', color: '#4a7fa5', kind: 'income' },
  ],

  // November 2026 income: 4800 + 2150 + 90 + 50 = $7,090.00
  // November 2026 spending: $3,546.18 (see the per-category sums below)
  transactions: [
    // ---- November 2026: income ----
    { id: 't001', date: '2026-11-01', type: 'income', category: 'salary', payee: 'Daniel — Paycheck', amount: 4800.00, note: 'Monthly salary, Maple Street Studio' },
    { id: 't002', date: '2026-11-01', type: 'income', category: 'salary', payee: 'Priya — Paycheck', amount: 2150.00, note: 'Monthly salary, Northside Clinic' },
    { id: 't003', date: '2026-11-15', type: 'income', category: 'interest', payee: 'First Community Bank', amount: 90.00, note: 'Savings account interest' },
    { id: 't004', date: '2026-11-20', type: 'income', category: 'other-income', payee: 'Utility Rebate', amount: 50.00, note: 'Energy-efficiency rebate' },
    // ---- November 2026: housing ----
    { id: 't005', date: '2026-11-01', type: 'expense', category: 'housing', payee: 'Maple Street Landlord', amount: 1450.00, note: 'November rent' },
    // ---- November 2026: groceries ($486.32) ----
    { id: 't006', date: '2026-11-03', type: 'expense', category: 'groceries', payee: 'GreenMart', amount: 142.10, note: 'Weekly shop' },
    { id: 't007', date: '2026-11-07', type: 'expense', category: 'groceries', payee: 'GreenMart', amount: 98.45, note: 'Weekly shop' },
    { id: 't008', date: '2026-11-10', type: 'expense', category: 'groceries', payee: 'Corner Market', amount: 121.30, note: 'Weekly shop' },
    { id: 't009', date: '2026-11-14', type: 'expense', category: 'groceries', payee: 'GreenMart', amount: 64.20, note: 'Top-up shop' },
    { id: 't010', date: '2026-11-21', type: 'expense', category: 'groceries', payee: 'Corner Market', amount: 60.27, note: 'Thanksgiving groceries' },
    // ---- November 2026: dining out ($214.75) ----
    { id: 't011', date: '2026-11-02', type: 'expense', category: 'dining', payee: "Luigi's Trattoria", amount: 68.40, note: 'Family dinner' },
    { id: 't012', date: '2026-11-08', type: 'expense', category: 'dining', payee: 'Noodle House', amount: 42.15, note: 'Lunch with Priya' },
    { id: 't013', date: '2026-11-15', type: 'expense', category: 'dining', payee: 'Burger Barn', amount: 58.90, note: 'Kids’ night out' },
    { id: 't014', date: '2026-11-22', type: 'expense', category: 'dining', payee: 'Café Aroma', amount: 45.30, note: 'Brunch' },
    // ---- November 2026: transport ($238.60) ----
    { id: 't015', date: '2026-11-05', type: 'expense', category: 'transport', payee: 'Shell Station', amount: 68.40, note: 'Gasoline' },
    { id: 't016', date: '2026-11-12', type: 'expense', category: 'transport', payee: 'Metro Transit', amount: 96.00, note: 'Monthly pass, Priya' },
    { id: 't017', date: '2026-11-19', type: 'expense', category: 'transport', payee: 'Shell Station', amount: 74.20, note: 'Gasoline' },
    // ---- November 2026: utilities ($355.73) ----
    { id: 't018', date: '2026-11-06', type: 'expense', category: 'utilities', payee: 'City Power', amount: 128.44, note: 'Electricity bill' },
    { id: 't019', date: '2026-11-09', type: 'expense', category: 'utilities', payee: 'City Water', amount: 62.30, note: 'Water bill' },
    { id: 't020', date: '2026-11-11', type: 'expense', category: 'utilities', payee: 'FiberNet', amount: 79.99, note: 'Internet, 300 Mbps' },
    { id: 't021', date: '2026-11-13', type: 'expense', category: 'utilities', payee: 'Mobile Co', amount: 85.00, note: 'Two phone lines' },
    // ---- November 2026: kids & school ($205.00) ----
    { id: 't022', date: '2026-11-04', type: 'expense', category: 'kids', payee: 'School Cafeteria', amount: 120.00, note: 'Leo & Sofia lunch cards' },
    { id: 't023', date: '2026-11-17', type: 'expense', category: 'kids', payee: 'Soccer Club', amount: 85.00, note: 'Leo, fall season fee' },
    // ---- November 2026: health ($123.90) ----
    { id: 't024', date: '2026-11-10', type: 'expense', category: 'health', payee: 'Corner Pharmacy', amount: 48.90, note: 'Prescriptions' },
    { id: 't025', date: '2026-11-24', type: 'expense', category: 'health', payee: 'Bright Smile Dental', amount: 75.00, note: 'Sofia check-up copay' },
    // ---- November 2026: shopping ($190.65) ----
    { id: 't026', date: '2026-11-16', type: 'expense', category: 'shopping', payee: 'Old Navy', amount: 132.40, note: 'Winter coats for the kids' },
    { id: 't027', date: '2026-11-26', type: 'expense', category: 'shopping', payee: 'Target', amount: 58.25, note: 'Household supplies' },
    // ---- November 2026: subscriptions ($29.97) ----
    { id: 't028', date: '2026-11-03', type: 'expense', category: 'subscriptions', payee: 'StreamFlix', amount: 15.99, note: 'Monthly plan' },
    { id: 't029', date: '2026-11-03', type: 'expense', category: 'subscriptions', payee: 'TuneBox', amount: 10.99, note: 'Music, family plan' },
    { id: 't030', date: '2026-11-05', type: 'expense', category: 'subscriptions', payee: 'CloudDrive', amount: 2.99, note: 'Photo backup, 200 GB' },
    // ---- November 2026: entertainment ($60.50) ----
    { id: 't031', date: '2026-11-14', type: 'expense', category: 'entertainment', payee: 'Riverside Cinema', amount: 42.00, note: 'Family movie night' },
    { id: 't032', date: '2026-11-23', type: 'expense', category: 'entertainment', payee: 'Bookshop on Main', amount: 18.50, note: 'Two paperbacks' },
    // ---- November 2026: insurance ($190.76) ----
    { id: 't033', date: '2026-11-25', type: 'expense', category: 'insurance', payee: 'SafeDrive Insurance', amount: 190.76, note: 'Car insurance, monthly' },

    // ---- October 2026: income $7,035.00 ----
    { id: 't101', date: '2026-10-01', type: 'income', category: 'salary', payee: 'Daniel — Paycheck', amount: 4800.00, note: 'Monthly salary' },
    { id: 't102', date: '2026-10-01', type: 'income', category: 'salary', payee: 'Priya — Paycheck', amount: 2150.00, note: 'Monthly salary' },
    { id: 't103', date: '2026-10-15', type: 'income', category: 'interest', payee: 'First Community Bank', amount: 85.00, note: 'Savings account interest' },
    // ---- October 2026: spending $3,288.55 ----
    { id: 't104', date: '2026-10-01', type: 'expense', category: 'housing', payee: 'Maple Street Landlord', amount: 1450.00, note: 'October rent' },
    { id: 't105', date: '2026-10-03', type: 'expense', category: 'groceries', payee: 'GreenMart', amount: 158.20, note: 'Weekly shop' },
    { id: 't106', date: '2026-10-10', type: 'expense', category: 'groceries', payee: 'GreenMart', amount: 132.75, note: 'Weekly shop' },
    { id: 't107', date: '2026-10-17', type: 'expense', category: 'groceries', payee: 'Corner Market', amount: 118.40, note: 'Weekly shop' },
    { id: 't108', date: '2026-10-24', type: 'expense', category: 'groceries', payee: 'GreenMart', amount: 96.55, note: 'Weekly shop' },
    { id: 't109', date: '2026-10-06', type: 'expense', category: 'dining', payee: 'Noodle House', amount: 54.30, note: 'Dinner' },
    { id: 't110', date: '2026-10-18', type: 'expense', category: 'dining', payee: 'Pizza Palace', amount: 48.60, note: 'Family pizza night' },
    { id: 't111', date: '2026-10-07', type: 'expense', category: 'transport', payee: 'Shell Station', amount: 72.10, note: 'Gasoline' },
    { id: 't112', date: '2026-10-12', type: 'expense', category: 'transport', payee: 'Metro Transit', amount: 96.00, note: 'Monthly pass, Priya' },
    { id: 't113', date: '2026-10-21', type: 'expense', category: 'transport', payee: 'Shell Station', amount: 61.85, note: 'Gasoline' },
    { id: 't114', date: '2026-10-08', type: 'expense', category: 'utilities', payee: 'City Power', amount: 121.60, note: 'Electricity bill' },
    { id: 't115', date: '2026-10-09', type: 'expense', category: 'utilities', payee: 'City Water', amount: 58.90, note: 'Water bill' },
    { id: 't116', date: '2026-10-11', type: 'expense', category: 'utilities', payee: 'FiberNet', amount: 79.99, note: 'Internet' },
    { id: 't117', date: '2026-10-13', type: 'expense', category: 'utilities', payee: 'Mobile Co', amount: 85.00, note: 'Two phone lines' },
    { id: 't118', date: '2026-10-05', type: 'expense', category: 'kids', payee: 'School Cafeteria', amount: 120.00, note: 'Lunch cards' },
    { id: 't119', date: '2026-10-14', type: 'expense', category: 'kids', payee: 'Art Class', amount: 65.00, note: 'Sofia, fall term' },
    { id: 't120', date: '2026-10-16', type: 'expense', category: 'health', payee: 'Corner Pharmacy', amount: 36.40, note: 'Prescriptions' },
    { id: 't121', date: '2026-10-20', type: 'expense', category: 'shopping', payee: 'Target', amount: 87.35, note: 'Household supplies' },
    { id: 't122', date: '2026-10-22', type: 'expense', category: 'shopping', payee: 'Old Navy', amount: 74.80, note: 'Fall clothes' },
    { id: 't123', date: '2026-10-03', type: 'expense', category: 'subscriptions', payee: 'StreamFlix', amount: 15.99, note: 'Monthly plan' },
    { id: 't124', date: '2026-10-03', type: 'expense', category: 'subscriptions', payee: 'TuneBox', amount: 10.99, note: 'Music, family plan' },
    { id: 't125', date: '2026-10-05', type: 'expense', category: 'subscriptions', payee: 'CloudDrive', amount: 2.99, note: 'Photo backup' },
    { id: 't126', date: '2026-10-25', type: 'expense', category: 'insurance', payee: 'SafeDrive Insurance', amount: 190.76, note: 'Car insurance, monthly' },
    { id: 't127', date: '2026-10-28', type: 'expense', category: 'entertainment', payee: 'Riverside Cinema', amount: 38.00, note: 'Movie night' },
    { id: 't128', date: '2026-10-30', type: 'expense', category: 'entertainment', payee: 'Bookshop on Main', amount: 12.03, note: 'One paperback' },

    // ---- September 2026: income $6,850.00 ----
    { id: 't201', date: '2026-09-01', type: 'income', category: 'salary', payee: 'Daniel — Paycheck', amount: 4700.00, note: 'Monthly salary' },
    { id: 't202', date: '2026-09-01', type: 'income', category: 'salary', payee: 'Priya — Paycheck', amount: 2050.00, note: 'Monthly salary' },
    { id: 't203', date: '2026-09-15', type: 'income', category: 'interest', payee: 'First Community Bank', amount: 100.00, note: 'Savings account interest' },
    // ---- September 2026: spending $3,180.39 ----
    { id: 't204', date: '2026-09-01', type: 'expense', category: 'housing', payee: 'Maple Street Landlord', amount: 1450.00, note: 'September rent' },
    { id: 't205', date: '2026-09-05', type: 'expense', category: 'groceries', payee: 'GreenMart', amount: 141.25, note: 'Weekly shop' },
    { id: 't206', date: '2026-09-12', type: 'expense', category: 'groceries', payee: 'GreenMart', amount: 126.80, note: 'Weekly shop' },
    { id: 't207', date: '2026-09-19', type: 'expense', category: 'groceries', payee: 'Corner Market', amount: 109.55, note: 'Weekly shop' },
    { id: 't208', date: '2026-09-26', type: 'expense', category: 'groceries', payee: 'GreenMart', amount: 88.30, note: 'Weekly shop' },
    { id: 't209', date: '2026-09-08', type: 'expense', category: 'dining', payee: 'Burger Barn', amount: 52.40, note: 'Dinner' },
    { id: 't210', date: '2026-09-20', type: 'expense', category: 'dining', payee: 'Noodle House', amount: 39.75, note: 'Lunch' },
    { id: 't211', date: '2026-09-06', type: 'expense', category: 'transport', payee: 'Shell Station', amount: 69.90, note: 'Gasoline' },
    { id: 't212', date: '2026-09-12', type: 'expense', category: 'transport', payee: 'Metro Transit', amount: 96.00, note: 'Monthly pass, Priya' },
    { id: 't213', date: '2026-09-22', type: 'expense', category: 'transport', payee: 'Shell Station', amount: 58.45, note: 'Gasoline' },
    { id: 't214', date: '2026-09-07', type: 'expense', category: 'utilities', payee: 'City Power', amount: 118.20, note: 'Electricity bill' },
    { id: 't215', date: '2026-09-09', type: 'expense', category: 'utilities', payee: 'City Water', amount: 55.60, note: 'Water bill' },
    { id: 't216', date: '2026-09-11', type: 'expense', category: 'utilities', payee: 'FiberNet', amount: 79.99, note: 'Internet' },
    { id: 't217', date: '2026-09-13', type: 'expense', category: 'utilities', payee: 'Mobile Co', amount: 85.00, note: 'Two phone lines' },
    { id: 't218', date: '2026-09-04', type: 'expense', category: 'kids', payee: 'School Cafeteria', amount: 120.00, note: 'Lunch cards' },
    { id: 't219', date: '2026-09-15', type: 'expense', category: 'kids', payee: 'Soccer Club', amount: 85.00, note: 'Leo, registration' },
    { id: 't220', date: '2026-09-18', type: 'expense', category: 'health', payee: 'Corner Pharmacy', amount: 42.15, note: 'Prescriptions' },
    { id: 't221', date: '2026-09-21', type: 'expense', category: 'shopping', payee: 'Target', amount: 92.10, note: 'Household supplies' },
    { id: 't222', date: '2026-09-03', type: 'expense', category: 'subscriptions', payee: 'StreamFlix', amount: 15.99, note: 'Monthly plan' },
    { id: 't223', date: '2026-09-03', type: 'expense', category: 'subscriptions', payee: 'TuneBox', amount: 10.99, note: 'Music, family plan' },
    { id: 't224', date: '2026-09-05', type: 'expense', category: 'subscriptions', payee: 'CloudDrive', amount: 2.99, note: 'Photo backup' },
    { id: 't225', date: '2026-09-25', type: 'expense', category: 'insurance', payee: 'SafeDrive Insurance', amount: 190.76, note: 'Car insurance, monthly' },
    { id: 't226', date: '2026-09-27', type: 'expense', category: 'entertainment', payee: 'Riverside Cinema', amount: 34.00, note: 'Movie night' },
    { id: 't227', date: '2026-09-29', type: 'expense', category: 'entertainment', payee: 'Bookshop on Main', amount: 15.22, note: 'One paperback' },
  ],

  // November 2026 category budgets. Total budget $3,645.00.
  // Groceries ($450) and Dining Out ($200) are over budget on purpose:
  // the site shows the over-budget warning for exactly those two.
  budgets: {
    '2026-11': {
      housing: 1450.00,
      groceries: 450.00,
      dining: 200.00,
      transport: 280.00,
      utilities: 380.00,
      kids: 220.00,
      health: 150.00,
      shopping: 200.00,
      subscriptions: 35.00,
      entertainment: 80.00,
      insurance: 200.00,
    },
  },

  // Fixed monthly bills. "paid" is the November 2026 state.
  // Unpaid November total: 128.44 + 62.30 + 85.00 + 190.76 + 35.00 = $501.50
  bills: [
    { id: 'b01', name: 'Rent', payee: 'Maple Street Landlord', amount: 1450.00, dueDay: 1, paid: true },
    { id: 'b02', name: 'Internet', payee: 'FiberNet', amount: 79.99, dueDay: 8, paid: true },
    { id: 'b03', name: 'Streaming', payee: 'StreamFlix', amount: 15.99, dueDay: 5, paid: true },
    { id: 'b04', name: 'Electricity', payee: 'City Power', amount: 128.44, dueDay: 12, paid: false },
    { id: 'b05', name: 'Water', payee: 'City Water', amount: 62.30, dueDay: 15, paid: false },
    { id: 'b06', name: 'Phone', payee: 'Mobile Co', amount: 85.00, dueDay: 20, paid: false },
    { id: 'b07', name: 'Car insurance', payee: 'SafeDrive Insurance', amount: 190.76, dueDay: 25, paid: false },
    { id: 'b08', name: 'Gym', payee: 'Riverside Fitness', amount: 35.00, dueDay: 10, paid: false },
  ],

  // Savings goals. "saved" is the balance at the end of November 2026.
  // Monthly need is computed from the target date (see store.js).
  goals: [
    { id: 'g01', name: 'Emergency fund', target: 12000.00, saved: 7450.00, targetDate: '2027-06-30', note: 'Six months of essential spending' },
    { id: 'g02', name: 'Family trip', target: 3500.00, saved: 1850.00, targetDate: '2027-03-31', note: 'Spring break road trip to the coast' },
    { id: 'g03', name: 'New car down payment', target: 8000.00, saved: 2300.00, targetDate: '2027-12-31', note: 'Replace the 2015 sedan' },
  ],

  tips: [
    'Groceries ran $36.32 over budget — plan meals before the weekly shop and the gap closes fast.',
    'Dining out is $14.75 over — one home-cooked family dinner a week saves about $50 a month.',
    'Your November savings rate is 50%: every dollar not spent is already working toward the goals.',
  ],
};
