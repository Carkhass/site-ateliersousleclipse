// src/scripts/init-client.js

import { initSwiper, initLightbox } from './init-swiper-glightbox.js';
import { observeCarousels } from './observer-carousels.js';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof window === 'undefined') return; // Sécurité SSR

  // Swipers statiques (ex: section 2)
  initSwiper();

  // Lightbox global (prend les liens actuels, Embla reconfirmera après sa propre init)
  initLightbox();

  // Initialisation au moment opportun des carrousels dynamiques
  observeCarousels();

  // Si reveal-on-scroll expose observeNewElements, on l'appelle
  if (typeof window.observeNewElements === 'function') {
    window.observeNewElements();
  }
});
