// src/scripts/init-swiper-glightbox.js
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';

export function initSwipers() {
  document.querySelectorAll('.swiper').forEach(swiperEl => {

    // Carrousel Hamon (Coverflow 3D)
    if (swiperEl.classList.contains('hamon-swiper')) {
      new Swiper(swiperEl, {
        loop: true,
        centeredSlides: true,
        slidesPerView: 'auto', // indispensable pour voir les latérales
        spaceBetween: 0,
        grabCursor: true,
        speed: 800,
        effect: 'coverflow',
        coverflowEffect: {
          rotate: 40,
          stretch: 0,
          depth: 200,
          modifier: 1.2,
          slideShadows: false
        },
        navigation: {
          nextEl: '.hamon-swiper .swiper-button-next',
          prevEl: '.hamon-swiper .swiper-button-prev'
        },
        pagination: {
          el: '.hamon-swiper .swiper-pagination',
          clickable: true
        }
      });
      return;
    }

    // Config générique pour les autres sliders
    new Swiper(swiperEl, {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: { el: '.swiper-pagination', clickable: true }
    });
  });
}

export function initLightbox() {
  GLightbox({ selector: '.glightbox' });
}
