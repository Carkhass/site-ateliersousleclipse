import Swiper, { Navigation, Pagination, EffectFade, Autoplay } from 'swiper';

// Import des CSS Swiper nécessaires
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';

export function initSwipers() {
  document.querySelectorAll('.swiper').forEach(swiperEl => {
    // Cas spécifique : carrousel premium de la section hamon
    if (swiperEl.classList.contains('hamon-swiper')) {
      new Swiper(swiperEl, {
        modules: [Navigation, Pagination, EffectFade, Autoplay],
        loop: true,
        effect: 'fade',
        fadeEffect: { crossFade: true },
        speed: 800,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      });
      return; // on sort pour ne pas ré-instancier
    }

    // Cas générique pour les autres sliders
    new Swiper(swiperEl, {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 'auto',
      spaceBetween: 20,
      loop: true,
      centeredSlides: true,
      grabCursor: true,
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    });
  });
}

export function initLightbox() {
  GLightbox({ selector: '.glightbox' });
}
