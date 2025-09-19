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

// Embla recovery + diagnostics (paste near the other heal code / end of file)
(function emblaRecoveryAndDiag() {
  if (typeof window === 'undefined') return;

  const LOG = (...args) => {
    try { console.debug('[embla-recover]', ...args); } catch (e) {}
  };

  const tryInitAll = () => {
    try {
      if (typeof initEmblaFn === 'function') {
        LOG('calling initEmblaFn(document)');
        initEmblaFn(document);
      } else if (typeof window.initEmbla === 'function') {
        LOG('calling window.initEmbla(document)');
        window.initEmbla(document);
      } else {
        LOG('no initEmbla function available');
      }
    } catch (e) {
      console.warn('[embla-recover] init call failed', e);
    }
  };

  const repairButtonsForce = () => {
    const prev = document.querySelectorAll('.embla__button--prev');
    const next = document.querySelectorAll('.embla__button--next');
    const allBtns = [...prev, ...next];
    allBtns.forEach(btn => {
      try {
        btn.removeAttribute('disabled');
        btn.disabled = false;
        btn.classList.remove('is-disabled');
      } catch (e) {}
    });
    LOG('force-removed disabled on', allBtns.length, 'buttons');
  };

  const reinitPerNodeIfNeeded = () => {
    const nodes = Array.from(document.querySelectorAll('.embla'));
    nodes.forEach((node, i) => {
      const marked = node.dataset && node.dataset.emblaInit === 'true';
      if (marked) {
        // If marked but we have no exposed instances, try to re-init just that node
        try {
          LOG(`node[${i}] marked inited=true — attempting targeted initEmbla(node)`);
          if (typeof initEmblaFn === 'function') initEmblaFn(node);
          else if (typeof window.initEmbla === 'function') window.initEmbla(node);
        } catch (e) {
          console.warn('[embla-recover] targeted init failed for node', i, e);
        }
      } else {
        LOG(`node[${i}] not marked inited (will try init)`);
        tryInitAll();
      }
    });
  };

  const attempts = { count: 0, max: 4 };

  const attemptCycle = () => {
    attempts.count++;
    LOG('attemptCycle', attempts.count, 'window._emblaAPIs length:', (window._emblaAPIs||[]).length);

    // 1) Try calling init globally
    tryInitAll();

    // 2) Short delay then check if instances exist
    setTimeout(() => {
      const count = (window._emblaAPIs || []).length;
      if (count > 0) {
        LOG('Embla instances present after attempt', attempts.count, 'count=', count);
        // Ensure buttons cleared
        repairButtonsForce();
        return;
      }

      // 3) If no instances, try re-init per node
      LOG('No global instances found — trying per-node reinit');
      reinitPerNodeIfNeeded();

      // 4) After another short delay, force-enable buttons if still no instances
      setTimeout(() => {
        const c2 = (window._emblaAPIs || []).length;
        LOG('post per-node reinit, _emblaAPIs length=', c2);
        if (c2 === 0) {
          // As a last resort, un-disable buttons so UI is usable (user-visible fix)
          repairButtonsForce();
        }
      }, 220);
    }, 220);

    if (attempts.count < attempts.max) {
      setTimeout(attemptCycle, 520 * attempts.count); // backoff-ish
    } else {
      LOG('attemptCycle completed max attempts');
    }
  };

  // Run on load/pageshow and as fallback after some interaction
  window.addEventListener('load', () => setTimeout(attemptCycle, 180));
  window.addEventListener('pageshow', () => setTimeout(attemptCycle, 180));
  // user interaction trigger (one-shot)
  const onUser = () => {
    setTimeout(attemptCycle, 120);
    window.removeEventListener('scroll', onUser);
    window.removeEventListener('click', onUser);
  };
  window.addEventListener('scroll', onUser, { passive: true });
  window.addEventListener('click', onUser);
})();
