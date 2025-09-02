import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';

export function initSwipers() {
  document.querySelectorAll('.swiper').forEach(swiperEl => {

    // Carrousel Hamon — effet parallaxe fluide
    if (swiperEl.classList.contains('hamon-swiper')) {
      new Swiper(swiperEl, {
        loop: true,
        slidesPerView: 1,
        speed: 1000,
        parallax: true,
        grabCursor: true,
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

    // Autres sliders
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
