// Maple & Main — main: boot the app, route on the hash, mark readiness.
// The state lives on window.__state so the views can read it; it is loaded
// once from localStorage (or from the seed data on first visit).

window.__state = loadState();
window.__shotReady = false;

function boot() {
  bindView();
  render(window.__state);
  // Re-render after the first paint so the screenshot flag is only set
  // once the page is actually on screen.
  requestAnimationFrame(() => {
    render(window.__state);
  });
}

window.addEventListener('hashchange', () => {
  window.__shotReady = false;
  window.scrollTo(0, 0);
  render(window.__state);
  requestAnimationFrame(() => {
    render(window.__state);
  });
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
