/**
 // public/scripts/layout/theme-toggle.js
 * Gère le basculement entre thème clair et sombre.
 * Sauvegarde la préférence dans localStorage.
 */

(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const rootHtml = document.documentElement;
  const btnTheme = document.getElementById('theme-toggle');

  try {
    const saved = localStorage.getItem('theme');
    if (saved) {
      rootHtml.classList.toggle('dark', saved === 'dark');
    }
  } catch (e) {
    // localStorage may be unavailable in some contexts; fail silently
  }

  if (!btnTheme) return;

  // Initialize button text based on current state
  btnTheme.textContent = rootHtml.classList.contains('dark') ? '☀️' : '🌙';

  btnTheme.addEventListener('click', () => {
    const isDark = rootHtml.classList.toggle('dark');
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (e) {}
    btnTheme.textContent = isDark ? '☀️' : '🌙';
  });
})();
