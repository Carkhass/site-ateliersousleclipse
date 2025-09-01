// src/scripts/init-swiper-glightbox.js
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';

export function initSwipers() {
  document.querySelectorAll('.swiper').forEach(swiperEl => {

    // Carrousel Hamon premium
    if (swiperEl.classList.contains('hamon-swiper')) {
      const swiper = new Swiper(swiperEl, {
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
          slideShadows: false // pas d'ombres Swiper, on gère en CSS
        },
        navigation: {
          nextEl: '.hamon-swiper .swiper-button-next',
          prevEl: '.hamon-swiper .swiper-button-prev'
        },
        pagination: {
          el: '.hamon-swiper .swiper-pagination',
          clickable: true
        },
        on: {
          // Avant la transition : reset uniquement les slides hors champ
          slideChangeTransitionStart(swiper) {
            swiper.slides.forEach(slide => {
              if (
                !slide.classList.contains('swiper-slide-prev') &&
                !slide.classList.contains('swiper-slide-next') &&
                !slide.classList.contains('swiper-slide-active')
              ) {
                const img = slide.querySelector('img');
                if (img) {
                  img.style.transition = 'transform 1.5s ease, box-shadow 0.6s ease, filter 0.6s ease';
                  img.style.transform = 'scale(1)';
                  img.style.boxShadow = '';
                  img.style.filter = '';
                }
              }
            });
          },
          // Après la transition : zoom sur la nouvelle active
          slideChangeTransitionEnd(swiper) {
            const activeImg = swiper.slides[swiper.activeIndex].querySelector('img');
            if (activeImg) {
              activeImg.style.transition = 'transform 1.5s ease, box-shadow 0.6s ease, filter 0.6s ease';
              activeImg.style.transform = 'scale(1.1)'; // zoom doux
              activeImg.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.5)';
              activeImg.style.filter = 'brightness(1.05) saturate(1.1)';
            }
          }
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
