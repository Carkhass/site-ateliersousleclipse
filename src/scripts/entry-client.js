// src/scripts/entry-client.js
// Point d'entrée client bundlé par Vite. Import des librairies npm puis initialisation des modules.

import EmblaCarousel from 'embla-carousel';
window.EmblaCarousel = window.EmblaCarousel || EmblaCarousel;
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import GLightbox from 'glightbox';
import '../styles/global.css';

/* expose uniquement les libs externes si besoin (pas les inits) */
if (typeof window !== 'undefined') {
  window.EmblaCarousel = EmblaCarousel && (EmblaCarousel.default || EmblaCarousel);
  window.Swiper = Swiper && (Swiper.default || Swiper);
  window.GLightbox = GLightbox && (GLightbox.default || GLightbox);
}

/* imports des modules d'initialisation */
import { observeCarousels as observeCarouselsFn } from './init/observer-carousels.js';
import { initEmbla as initEmblaFn } from './init/init-embla.js';
import { initSwipers as initSwipersFn } from './init/init-swiper-glightbox.js';

/* autres imports non critiques */
import './animations/reveal-on-scroll.js';
import './animations/text-slide-fade-anim.js';
import './features/carte-3d.js';
import './layout/header-sticky.js';
import './layout/hero-animation.js';
import './layout/menu-mobile.js';
import './layout/parallax.js';
import './layout/theme-toggle.js';

/* Fallback robuste pour s'assurer que tous les .embla sont initialisés */
function ensureInitAllEmbla() {
  if (!initEmblaFn) return;
  document.querySelectorAll('.embla').forEach((el, i) => {
    if (el.dataset && el.dataset.emblaInit === 'true') return;
    setTimeout(() => {
      try { initEmblaFn(el); } catch (e) { console.warn('ensureInitAllEmbla init error', e); }
    }, 80 + i * 30);
  });
}

/* Démarrage contrôlé : on invoque directement les fonctions importées */
document.addEventListener('DOMContentLoaded', () => {
  try { observeCarouselsFn && observeCarouselsFn(); } catch (e) { console.warn('observeCarousels error', e); }

  // fallback: attempt to init any embla that may have been missed by the observer
  setTimeout(() => {
    try { initEmblaFn && initEmblaFn(); } catch (e) { console.warn('initEmbla error', e); }
    try { initSwipersFn && initSwipersFn(); } catch (e) { console.warn('initSwipers error', e); }
  }, 120);
});

/* sécurité supplémentaire sur load */
window.addEventListener('load', () => {
  setTimeout(() => {
    try { initEmblaFn && initEmblaFn(); } catch (e) {}
  }, 80);
});

// gentle global heal for odd prod timing
window.addEventListener('load', () => {
  setTimeout(() => {
    try { initEmblaFn && initEmblaFn(); } catch (e) {}
  }, 220);
  // final sanity after slightly longer window
  setTimeout(() => {
    try { initEmblaFn && initEmblaFn(); } catch (e) {}
  }, 800);
});
