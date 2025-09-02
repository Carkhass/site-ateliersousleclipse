import { initSwipers, initLightbox } from './init-swiper-glightbox.js';
import { initEmbla } from './init-embla.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialisation des sliders Swiper (sections qui l'utilisent encore)
  initSwipers();

  // Initialisation du carrousel Embla (section Inspiration)
  initEmbla();

  // Initialisation de GLightbox APRES Embla
  // Petit délai pour s'assurer que le DOM des slides est prêt
  setTimeout(() => {
    initLightbox();
  }, 0);

  // Si le script reveal-on-scroll est chargé et expose observeNewElements(),
  // on force un rescan pour inclure les éléments ajoutés par Swiper/Embla/GLightbox
  if (typeof window.observeNewElements === 'function') {
    window.observeNewElements();
  }
});
