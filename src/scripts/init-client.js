import { initSwipers, initLightbox } from './init-swiper-glightbox.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialisation des sliders Swiper
  initSwipers();

  // Initialisation de GLightbox
  initLightbox();

  // Si le script reveal-on-scroll est chargé et expose observeNewElements(),
  // on force un rescan pour inclure les éléments ajoutés par Swiper/GLightbox
  if (typeof window.observeNewElements === 'function') {
    window.observeNewElements();
  }
});
