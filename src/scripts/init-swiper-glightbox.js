// src/scripts/init-swiper-glightbox.js
import Swiper from 'swiper';
import { Navigation, Pagination, EffectFade, Autoplay, Parallax } from 'swiper/modules';

// Important: styles Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/parallax';

import GLightbox from 'glightbox';

export function initSwipers(root = document) {
  const swiperEls = root.querySelectorAll
    ? root.querySelectorAll('.swiper')
    : document.querySelectorAll('.swiper');

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

    if (el.classList.contains('hamon-swiper')) {
      new Swiper(el, {
        modules: [Navigation, Pagination, Autoplay, Parallax],
        loop: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 20,
        speed: 900,
        parallax: true,
        grabCursor: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        navigation: {
          nextEl: el.querySelector('.swiper-button-next'),
          prevEl: el.querySelector('.swiper-button-prev')
        },
        pagination: {
          el: el.querySelector('.swiper-pagination'),
          clickable: true
        }
      });
      return;
    }

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
