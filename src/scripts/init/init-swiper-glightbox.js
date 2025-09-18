// public/scripts/init/init-swiper-glightbox.js
// Init Swiper and GLightbox
(function () {
  // Try to access Swiper from global or dynamic import
  function getSwiperModule() {
    if (typeof window !== 'undefined' && window.Swiper) {
      return Promise.resolve({ default: window.Swiper });
    }
    // Try dynamic import and let the promise reject if not available
    return import('swiper/bundle').catch(() => {
      console.warn('swiper dynamic import failed; ensure swiper is bundled or available globally.');
      return Promise.reject(new Error('swiper not available'));
    });
  }

  function initSwiper() {
    if (typeof window === 'undefined') return;
    return getSwiperModule()
      .then((mod) => {
        const Swiper = mod.default || mod;
        const swiperElements = document.querySelectorAll('.swiper');
        swiperElements.forEach((swiperEl) => {
          const nextEl = swiperEl.querySelector('.swiper-button-next');
          const prevEl = swiperEl.querySelector('.swiper-button-prev');
          const paginationEl = swiperEl.querySelector('.swiper-pagination');

          const options = {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 10,
            navigation: {
              nextEl: nextEl,
              prevEl: prevEl
            },
            pagination: {
              el: paginationEl,
              clickable: true
            }
          };
          // eslint-disable-next-line no-new
          new Swiper(swiperEl, options);
        });
      })
      .catch((err) => {
        console.warn('initSwiper skipped: ', err);
      });
  }

  function initLightbox() {
    if (typeof window === 'undefined') return;
    // Try dynamic import of glightbox; will reject if not available
    import('glightbox')
      .then((mod) => {
        const GLightbox = mod.default || mod;
        GLightbox({
          selector: '.embla-spotlight, .hamon-photo',
          touchNavigation: true,
          loop: true,
          openEffect: 'fade',
          closeEffect: 'fade',
          slideEffect: 'slide',
          slideDuration: 420,
          skin: 'hamon'
        });
      })
      .catch((err) => {
        console.warn('GLightbox dynamic import failed; ensure GLightbox is available.', err);
      });
  }

  function initSwiperAndLightbox() {
    initSwiper();
    initLightbox();
  }

  window.initSwiper = initSwiper;
  window.initLightbox = initLightbox;
  window.initSwiperAndLightbox = initSwiperAndLightbox;
})();
