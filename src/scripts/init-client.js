import { initSwipers, initLightbox } from './init-swiper-glightbox.js';
import { initEmbla } from './init-embla.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialisation Swiper
  initSwipers();

  // Initialisation Embla
  initEmbla();

  // Initialisation unique de la lightbox
  // On détruit toute instance précédente pour éviter les doublons
  if (window.__glb) {
    window.__glb.destroy();
    window.__glb = null;
  }
  initLightbox();

  // Debug : vérifier que le clic part bien du lien attendu
  document.querySelectorAll('.embla-spotlight').forEach(link => {
    link.addEventListener('click', (e) => {
      console.log('[DEBUG] Clic sur', e.currentTarget);
    });
  });

  // Relance du reveal-on-scroll si présent
  if (typeof window.observeNewElements === 'function') {
    window.observeNewElements();
  }
});
