/**
 * Gère le basculement entre thème clair et sombre.
 * Sauvegarde la préférence dans localStorage.
 * Version premium : combine préférence utilisateur, thème système et fallback jour/nuit.
 */
// src/scripts/layout/theme-toggle.js
export function initThemeToggle() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const rootHtml = document.documentElement;
  const btnTheme = document.getElementById('theme-toggle');

  // --- Helpers ---
  const setTheme = (mode, persist = true) => {
    rootHtml.classList.toggle('dark', mode === 'dark');
    rootHtml.classList.toggle('light', mode === 'light');
    if (btnTheme) btnTheme.textContent = mode === 'dark' ? '☀️' : '🌙';
    if (persist) {
      try { localStorage.setItem('theme', mode); } catch (e) {}
    }
  };

  const getSystemTheme = () =>
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  const getTimeBasedTheme = () => {
    const hour = new Date().getHours();
    return (hour >= 20 || hour < 7) ? 'dark' : 'light';
  };

  // --- Initialisation ---
  let initialTheme = null;

  try {
    const saved = localStorage.getItem('theme');
    if (saved) {
      initialTheme = saved; // priorité au choix utilisateur
    }
  } catch (e) {}

  if (!initialTheme) {
    // sinon on suit le système
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').media !== 'not all') {
      initialTheme = getSystemTheme();
    } else {
      // fallback heure locale
      initialTheme = getTimeBasedTheme();
    }
  }

  setTheme(initialTheme, false);

  // --- Écoute les changements système (si pas d’override utilisateur) ---
  if (!localStorage.getItem('theme') && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', e => {
        setTheme(e.matches ? 'dark' : 'light', false);
      });
  }

  // --- Bouton manuel ---
  if (btnTheme) {
    btnTheme.addEventListener('click', () => {
      const isDark = rootHtml.classList.toggle('dark');
      rootHtml.classList.toggle('light', !isDark);
      const mode = isDark ? 'dark' : 'light';
      try { localStorage.setItem('theme', mode); } catch (e) {}
      btnTheme.textContent = isDark ? '☀️' : '🌙';
    });
  }
}
