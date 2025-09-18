// src/scripts/entry-client.js
// Point d'entrée client bundlé par Vite. Import des librairies npm puis initialisation des modules.

import EmblaCarousel from 'embla-carousel';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import GLightbox from 'glightbox';

// Expose si certains inits attendent window globals (optionnel mais pratique)
if (typeof window !== 'undefined') {
  window.EmblaCarousel = EmblaCarousel && (EmblaCarousel.default || EmblaCarousel);
  window.Swiper = Swiper && (Swiper.default || Swiper);
  window.GLightbox = GLightbox && (GLightbox.default || GLightbox);
}

// Imports depuis src/scripts (chemins relatifs depuis ce fichier)
import './animations/reveal-on-scroll.js';
import './animations/text-slide-fade-anim.js';
import './features/carte-3d.js';
import './layout/header-sticky.js';
import './layout/hero-animation.js';
import './layout/menu-mobile.js';
import './layout/parallax.js';
import './layout/theme-toggle.js';
import './init/observer-carousels.js';
import './init/init-embla.js';
import './init/init-swiper-glightbox.js';

// Start inits that should run globally at load
document.addEventListener('DOMContentLoaded', () => {
  // observer-carousels will lazily init carousels when in view
  if (window.observeCarousels) window.observeCarousels();

  // optional eager inits
  if (window.initEmbla) window.initEmbla();
  if (window.initSwiperAndLightbox) window.initSwiperAndLightbox();
});
