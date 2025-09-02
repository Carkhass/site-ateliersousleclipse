import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';

export function initSwipers() {
  document.querySelectorAll('.swiper').forEach(swiperEl => {

    if (swiperEl.classList.contains('hamon-swiper')) {
      const swiper = new Swiper(swiperEl, {
        loop: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 0,
        grabCursor: true,
        speed: 800,
        effect: 'coverflow',
        coverflowEffect: {
          rotate: 40,
          stretch: 0,
          depth: 300,
          modifier: 1.4,
          slideShadows: false
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
          slideChangeTransitionStart() {
            swiper.slides.forEach(slide => {
              slide.classList.remove('slide-left-1', 'slide-left-2', 'slide-right-1', 'slide-right-2');
            });

            const active = swiper.realIndex;
            const total = swiper.slides.length;

            swiper.slides.forEach((slide, i) => {
              const index = swiper.slides[i].swiperSlideIndex;
              const offset = (index - active + total) % total;

              if (offset === 1) slide.classList.add('slide-right-1');
              if (offset === 2) slide.classList.add('slide-right-2');
              if (offset === total - 1) slide.classList.add('slide-left-1');
              if (offset === total - 2) slide.classList.add('slide-left-2');
            });
          }
        }
      });

      return;
    }

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
