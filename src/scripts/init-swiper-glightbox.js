// init-swiper-glightbox.js

import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

// Initialisation Swiper
export function initSwiper() {
  if (typeof window === 'undefined') return; // Sécurité SSR

  const swiperElements = document.querySelectorAll('.swiper');
  swiperElements.forEach((swiperEl) => {
    new Swiper(swiperEl, {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 10,
      navigation: {
        nextEl: swiperEl.querySelector('.swiper-button-next'),
        prevEl: swiperEl.querySelector('.swiper-button-prev'),
      },
      pagination: {
        el: swiperEl.querySelector('.swiper-pagination'),
        clickable: true,
      },
    });
  });
}

// Initialisation GLightbox (import dynamique)
export function initLightbox() {
  if (typeof window === 'undefined') return; // Sécurité SSR

  import('glightbox').then(({ default: GLightbox }) => {
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
  }).catch((err) => {
    console.error('Erreur lors du chargement de GLightbox :', err);
  });
}

// Fonction d'init globale
export function initSwiperAndLightbox() {
  initSwiper();
  initLightbox();
}
