// public/scripts/init/observer-carousels.js
(function () {
  function observeCarousels() {
    const EMBLA_SELECTOR = '.embla';
    const SWIPER_SELECTOR = '.swiper';

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;

        if (el.matches(EMBLA_SELECTOR)) {
          if (window.initEmbla) {
            window.initEmbla(el);
          } else {
            // fallback: try to import and then init
            import('./init-embla.js')
              .then(() => {
                window.initEmbla && window.initEmbla(el);
              })
              .catch(() => {});
          }
        }

        if (el.matches(SWIPER_SELECTOR)) {
          if (window.initSwiper) {
            window.initSwiper();
          } else {
            import('./init-swiper-glightbox.js')
              .then(() => {
                window.initSwiper && window.initSwiper();
              })
              .catch(() => {});
          }
        }

        obs.unobserve(el);
      });
    }, { threshold: 0.2 });

    document.querySelectorAll(`${EMBLA_SELECTOR}, ${SWIPER_SELECTOR}`).forEach((el) => observer.observe(el));
  }

  window.observeCarousels = observeCarousels;
})();
