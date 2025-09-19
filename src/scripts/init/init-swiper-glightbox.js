// src/scripts/init/init-swiper-glightbox.js
export async function initSwipers(root) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const container = root && root.querySelectorAll ? root : document;

  const { default: Swiper } = await import('swiper');
  const { Navigation, Pagination, EffectFade, Autoplay } = await import('swiper/modules');

  const swiperEls = container.querySelectorAll('.swiper');
  swiperEls.forEach((el) => {
    if (el.dataset.swiperInit === 'true') return;
    el.dataset.swiperInit = 'true';

    if (el.classList.contains('swiper-section2')) {
      new Swiper(el, {
        modules: [EffectFade, Autoplay],
        effect: 'fade',
        fadeEffect: { crossFade: true },
        loop: true,
        autoplay: { delay: 3500, disableOnInteraction: false },
        speed: 1600
      });
      return;
    }

    new Swiper(el, {
      modules: [Navigation, Pagination],
      loop: true,
      slidesPerView: 1,
      centeredSlides: false,
      spaceBetween: 20,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    });
  });
}

export async function initLightbox() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const { default: GLightbox } = await import('glightbox');
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
}
