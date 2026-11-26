// Maple & Main — charts: hand-written SVG, no library, no network.
// Every chart is a pure function of numbers in, SVG string out, so the
// dashboard, budgets and trends pages all draw from the same helpers.

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// A donut: parts is [{label, value, color}]. The centre shows the total.
function donutSVG(parts, size, totalLabel) {
  const total = parts.reduce((a, p) => a + p.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r - 26;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  let arcs = '';
  for (const p of parts) {
    if (p.value <= 0 || total <= 0) continue;
    const frac = p.value / total;
    const len = Math.max(0, frac * circ - 2);
    arcs += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + p.color +
      '" stroke-width="26" stroke-dasharray="' + len.toFixed(1) + ' ' + (circ - len).toFixed(1) +
      '" stroke-dashoffset="' + (-offset).toFixed(1) +
      '" transform="rotate(-90 ' + cx + ' ' + cy + ')" />';
    offset += frac * circ;
  }
  if (!parts.length || total <= 0) {
    return '<svg class="donut" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Spending by category donut chart">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#e3dccb" stroke-width="26" />' +
      '<text x="' + cx + '" y="' + cy + '" text-anchor="middle" class="donut-total">' + esc(fmt(0)) + '</text>' +
      '<text x="' + cx + '" y="' + (cy + 20) + '" text-anchor="middle" class="donut-label">' + esc(totalLabel) + '</text></svg>';
  }
  const pct = total > 0 ? Math.round((parts[0].value / total) * 100) : 0;
  return '<svg class="donut" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Spending by category donut chart">' +
    arcs +
    '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" class="donut-total">' + esc(fmt(total)) + '</text>' +
    '<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" class="donut-label">' + esc(totalLabel) + '</text>' +
    '<text x="' + cx + '" y="' + (cy + 36) + '" text-anchor="middle" class="donut-sub">top: ' + esc(parts[0].label) + ' ' + pct + '%</text>' +
    '</svg>';
}

// Grouped bars: months on the x axis, one income bar and one spending bar
// per month. Values are labelled on top of each bar.
function groupedBarsSVG(months, income, expense) {
  const W = 640;
  const H = 300;
  const padL = 58;
  const padB = 34;
  const padT = 30;
  const max = Math.max.apply(null, income.concat(expense).concat([1]));
  const plotH = H - padT - padB;
  const plotW = W - padL - 16;
  const groupW = plotW / months.length;
  const barW = Math.min(52, groupW * 0.3);
  let grid = '';
  for (let i = 0; i <= 4; i++) {
    const v = (max / 4) * i;
    const y = padT + plotH - (plotH * i) / 4;
    grid += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (W - 16) + '" y2="' + y.toFixed(1) + '" class="grid-line" />' +
      '<text x="' + (padL - 8) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end" class="axis-label">$' + Math.round(v).toLocaleString('en-US') + '</text>';
  }
  let bars = '';
  months.forEach((m, gi) => {
    const gx = padL + gi * groupW + groupW / 2;
    const pairs = [
      { v: income[gi], cls: 'bar-income', dx: -barW - 3 },
      { v: expense[gi], cls: 'bar-expense', dx: 3 },
    ];
    for (const b of pairs) {
      const h = Math.max(2, (plotH * b.v) / max);
      const x = gx + b.dx;
      const y = padT + plotH - h;
      bars += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW + '" height="' + h.toFixed(1) +
        '" rx="3" class="' + b.cls + '" />' +
        '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" text-anchor="middle" class="bar-value">$' +
        Math.round(b.v).toLocaleString('en-US') + '</text>';
    }
    bars += '<text x="' + gx.toFixed(1) + '" y="' + (H - 12) + '" text-anchor="middle" class="axis-label">' + esc(m) + '</text>';
  });
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Monthly income versus spending bar chart">' +
    grid + bars +
    '<g class="legend" transform="translate(' + (W - 210) + ', 6)">' +
    '<rect x="0" y="0" width="12" height="12" rx="2" class="bar-income" /><text x="17" y="11">Income</text>' +
    '<rect x="90" y="0" width="12" height="12" rx="2" class="bar-expense" /><text x="107" y="11">Spending</text></g>' +
    '</svg>';
}

// Horizontal share bars: rows is [{label, value, color}], sorted already.
function shareBarsHTML(rows) {
  const total = rows.reduce((a, r) => a + r.value, 0);
  let html = '<ul class="share-list">';
  for (const r of rows) {
    const pct = total > 0 ? (r.value / total) * 100 : 0;
    html += '<li><div class="share-row"><span class="share-label">' + esc(r.label) + '</span>' +
      '<span class="share-value">' + esc(fmt(r.value)) + ' · ' + pct.toFixed(1) + '%</span></div>' +
      '<div class="share-track"><div class="share-fill" style="width:' + pct.toFixed(1) + '%;background:' + r.color + '"></div></div></li>';
  }
  return html + '</ul>';
}

// Small income-vs-spending bars for the dashboard KPI card.
// The bar area leaves room for the value label after the longest bar.
function miniBarsSVG(income, expense) {
  const W = 440;
  const H = 96;
  const labelX = 70;
  const barMax = 250;
  const max = Math.max(income, expense, 1);
  const iw = Math.max(4, barMax * (income / max));
  const ew = Math.max(4, barMax * (expense / max));
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Income versus spending mini chart">' +
    '<text x="0" y="24" class="mini-label">Income</text>' +
    '<rect x="' + labelX + '" y="10" width="' + iw.toFixed(1) + '" height="18" rx="3" class="bar-income" />' +
    '<text x="' + (labelX + iw + 8).toFixed(1) + '" y="24" class="mini-value">' + esc(fmt(income)) + '</text>' +
    '<text x="0" y="62" class="mini-label">Spent</text>' +
    '<rect x="' + labelX + '" y="48" width="' + ew.toFixed(1) + '" height="18" rx="3" class="bar-expense" />' +
    '<text x="' + (labelX + ew + 8).toFixed(1) + '" y="62" class="mini-value">' + esc(fmt(expense)) + '</text>' +
    '</svg>';
}
