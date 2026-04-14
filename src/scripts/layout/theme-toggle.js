/**
 * Gère le basculement entre thème clair et sombre.
 * Sauvegarde la préférence dans localStorage.
 * Respecte : 1. Choix manuel / 2. Préférence Système / 3. Heure locale.
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

  const getAutoTheme = () => {
    // 1. On vérifie d'abord si le système a une préférence explicite
    if (window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
      if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    }

    // 2. Si le système est neutre ou non détecté, on suit l'heure (20h-7h = nuit)
    const hour = new Date().getHours();
    return (hour >= 20 || hour < 7) ? 'dark' : 'light';
  };

  // --- Initialisation ---
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('theme');
  } catch (e) {}

  // Priorité au choix sauvegardé, sinon calcul automatique respectueux
  const initialTheme = savedTheme || getAutoTheme();
  setTheme(initialTheme, false);

  // --- Écoute les changements système (uniquement si pas de choix manuel) ---
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (!localStorage.getItem('theme')) {
          setTheme(getAutoTheme(), false);
        }
      });
  }

  // --- Le "Gardien du Temps" ---
  // Vérifie toutes les minutes si on doit basculer (si pas d’override manuel)
  setInterval(() => {
    if (!localStorage.getItem('theme')) {
      const targetTheme = getAutoTheme();
      if (!rootHtml.classList.contains(targetTheme)) {
        setTheme(targetTheme, false);
      }
    }
  }, 60000);

  // --- Bouton manuel ---
  if (btnTheme) {
    btnTheme.addEventListener('click', () => {
      const isCurrentlyDark = rootHtml.classList.contains('dark');
      const newMode = isCurrentlyDark ? 'light' : 'dark';
      setTheme(newMode, true); // Ici on persiste le choix de l'utilisateur
    });
  }
}