import { initSwipers, initLightbox } from './init-swiper-glightbox.js';
import { initEmbla } from './init-embla.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialisation des sliders Swiper (sections qui l'utilisent encore)
  initSwipers();

  // Initialisation du carrousel Embla (section Inspiration)
  initEmbla();

  // Initialisation de GLightbox
  initLightbox();

  // Si le script reveal-on-scroll est chargé et expose observeNewElements(),
  // on force un rescan pour inclure les éléments ajoutés par Swiper/Embla/GLightbox
  if (typeof window.observeNewElements === 'function') {
    window.observeNewElements();
  }
});
