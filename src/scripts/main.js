// public/scripts/main.js

// Défensif : attendre que DOM soit prêt pour les comportements qui touchent le DOM.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMain);
} else {
  initMain();
}

function initMain() {
  // --- Layout / UI global ---
  import('./layout/header-sticky.js');
  import('./layout/hero-animation.js');
  import('./layout/menu-mobile.js');
  import('./layout/theme-toggle.js');

  // --- Animations globales ---
  import('./animations/reveal-on-scroll.js');

  // --- Features globales ---
  import('./features/carte-3d.js');

  // --- Init carrousels (si présents) ---
  import('./init/observer-carousels.js');
}
