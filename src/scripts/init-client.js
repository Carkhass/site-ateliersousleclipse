import { initSwipers, initLightbox } from './init-swiper-glightbox.js';
import { initEmbla } from './init-embla.js';

document.addEventListener('DOMContentLoaded', () => {
  initSwipers();
  initEmbla();
  initLightbox();

  if (typeof window.observeNewElements === 'function') {
    window.observeNewElements();
  }
});
