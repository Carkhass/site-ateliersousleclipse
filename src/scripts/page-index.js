// public/scripts/page-index.js

// Charger les inits spécifiques à la page quand le DOM est prêt.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPageIndex);
} else {
  initPageIndex();
}

function initPageIndex() {
  import('./init/init-embla.js');
  import('./init/init-swiper-glightbox.js');
}
