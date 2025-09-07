// src/scripts/init-swiper-glightbox.js
import Swiper from 'swiper';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';

import GLightbox from 'glightbox';

export function initSwipers(root = document) {
  const swiperEls = root.querySelectorAll
    ? root.querySelectorAll('.swiper')
    : document.querySelectorAll('.swiper');

  swiperEls.forEach((el) => {
    if (el.dataset.swiperInit === 'true') return;
    el.dataset.swiperInit = 'true';

    // Section 2
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

    // Slider par défaut
    new Swiper(el, {
      modules: [Navigation, Pagination],
      loop: true,
      slidesPerView: 1,
      spaceBetween: 20,
      navigation: {
        nextEl: el.querySelector('.swiper-button-next'),
        prevEl: el.querySelector('.swiper-button-prev')
      },
      pagination: {
        el: el.querySelector('.swiper-pagination'),
        clickable: true
      }
    });
  });
}

export function initLightbox() {
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
