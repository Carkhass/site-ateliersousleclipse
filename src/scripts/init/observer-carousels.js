// src/scripts/init/observer-carousels.js
import { initEmbla } from './init-embla.js';
import { initSwipers } from './init-swiper-glightbox.js';

export function initObserverCarousels() {
  if (typeof window === 'undefined' || typeof document === 'undefined' || typeof IntersectionObserver === 'undefined') return;

  const EMBLA_SELECTOR = '.embla';
  const SWIPER_SELECTOR = '.swiper';

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      if (el.matches(EMBLA_SELECTOR)) initEmbla(el);
      if (el.matches(SWIPER_SELECTOR)) initSwipers(el);

      observer.unobserve(el);
    });
  }, { threshold: 0.2 });

  document
    .querySelectorAll(`${EMBLA_SELECTOR}, ${SWIPER_SELECTOR}`)
    .forEach(el => observer.observe(el));
}
