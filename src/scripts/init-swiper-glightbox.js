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
    new Swiper('.my-knives-swiper', {
  modules: [Navigation, Pagination],
  loop: true,
  slidesPerView: 1,
  centeredSlides: false,
  spaceBetween: 20,
  navigation: {
    nextEl: '.my-knives-swiper .swiper-button-next',
    prevEl: '.my-knives-swiper .swiper-button-prev'
  },
  pagination: {
    el: '.swiper-pagination', // pagination externe
    clickable: true
  },
  
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
