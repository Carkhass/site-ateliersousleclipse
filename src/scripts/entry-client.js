// src/scripts/entry-client.js
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Lazy‑load des modules internes
  Promise.all([
    import('./init/observer-carousels.js'),
    import('./init/init-embla.js'),
    import('./init/init-swiper-glightbox.js'),
    import('./animations/reveal-on-scroll.js'),
    import('./animations/text-slide-fade-anim.js'),
    import('./features/carte-3d.js'),
    import('./layout/header-sticky.js'),
    import('./layout/hero-animation.js'),
    import('./layout/menu-mobile.js'),
    import('./layout/parallax.js'),
    import('./layout/theme-toggle.js')
  ]).then(([
    { observeCarousels },
    { initEmbla },
    { initSwipers, initLightbox }
  ]) => {
    // Init carousels
    observeCarousels?.();

    // Fallback init forcé
    setTimeout(() => {
      try { initEmbla?.(); } catch (e) { console.warn('initEmbla error', e); }
      try { initSwipers?.(); } catch (e) { console.warn('initSwipers error', e); }
      try { initLightbox?.(); } catch (e) { console.warn('initLightbox error', e); }
    }, 120);

    // Sécurité supplémentaire sur load
    window.addEventListener('load', () => {
      setTimeout(() => {
        try { initEmbla?.(); } catch (e) {}
      }, 80);
    });

    // Embla recovery + diagnostics (repris de ton code)
    (function emblaRecoveryAndDiag() {
      const LOG = (...args) => { try { console.debug('[embla-recover]', ...args); } catch (e) {} };

      const tryInitAll = () => {
        try {
          if (typeof initEmbla === 'function') {
            LOG('calling initEmbla(document)');
            initEmbla(document);
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
        [...prev, ...next].forEach(btn => {
          try {
            btn.removeAttribute('disabled');
            btn.disabled = false;
            btn.classList.remove('is-disabled');
          } catch (e) {}
        });
        LOG('force-removed disabled on', prev.length + next.length, 'buttons');
      };

      const reinitPerNodeIfNeeded = () => {
        const nodes = Array.from(document.querySelectorAll('.embla'));
        nodes.forEach((node, i) => {
          const marked = node.dataset?.emblaInit === 'true';
          if (marked) {
            try {
              LOG(`node[${i}] marked inited=true — attempting targeted initEmbla(node)`);
              if (typeof initEmbla === 'function') initEmbla(node);
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

        tryInitAll();

        setTimeout(() => {
          const count = (window._emblaAPIs || []).length;
          if (count > 0) {
            LOG('Embla instances present after attempt', attempts.count, 'count=', count);
            repairButtonsForce();
            return;
          }

          LOG('No global instances found — trying per-node reinit');
          reinitPerNodeIfNeeded();

          setTimeout(() => {
            const c2 = (window._emblaAPIs || []).length;
            LOG('post per-node reinit, _emblaAPIs length=', c2);
            if (c2 === 0) {
              repairButtonsForce();
            }
          }, 220);
        }, 220);

        if (attempts.count < attempts.max) {
          setTimeout(attemptCycle, 520 * attempts.count);
        } else {
          LOG('attemptCycle completed max attempts');
        }
      };

      window.addEventListener('load', () => setTimeout(attemptCycle, 180));
      window.addEventListener('pageshow', () => setTimeout(attemptCycle, 180));
      const onUser = () => {
        setTimeout(attemptCycle, 120);
        window.removeEventListener('scroll', onUser);
        window.removeEventListener('click', onUser);
      };
      window.addEventListener('scroll', onUser, { passive: true });
      window.addEventListener('click', onUser);
    })();
  }).catch(err => console.error('Erreur import modules internes', err));

  // Lazy‑load des libs externes
  Promise.all([
    import('embla-carousel'),
    import('swiper/bundle'),
    import('glightbox')
  ]).then(([{ default: EmblaCarousel }, { default: Swiper }, { default: GLightbox }]) => {
    window.EmblaCarousel = EmblaCarousel;
    window.Swiper = Swiper;
    window.GLightbox = GLightbox;
  }).catch(err => console.error('Erreur import libs externes', err));
}
