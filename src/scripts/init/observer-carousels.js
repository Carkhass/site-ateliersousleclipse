// src/scripts/init/observer-carousels.js
// Rôle: initialiser Embla/Swiper au moment opportun (visibles dans le viewport),
// pour éviter les calculs sur éléments masqués.

import { initEmbla } from './init-embla.js';
import { initSwipers } from './init-swiper-glightbox.js';

export function observeCarousels() {
  const EMBLA_SELECTOR = '.embla';
  const SWIPER_SELECTOR = '.swiper';

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;

      // Embla: init ciblée
      if (el.matches(EMBLA_SELECTOR)) {
        initEmbla(el); // init uniquement ce carousel
      }

      // Swiper: si besoin d'instancier dynamiquement (optionnel)
      if (el.matches(SWIPER_SELECTOR)) {
        initSwipers(el); // init ciblée (fonction supporte root optionnel)
      }

      observer.unobserve(el);
    });
  }, { threshold: 0.2 });

  // Observer tous les carrousels présents
  document.querySelectorAll(`${EMBLA_SELECTOR}, ${SWIPER_SELECTOR}`).forEach(el => observer.observe(el));
}
