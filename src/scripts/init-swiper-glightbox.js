import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import GLightbox from 'glightbox';

export function initSwipers() {
  const swiperEls = document.querySelectorAll('.swiper');
  swiperEls.forEach((el) => {
    new Swiper(el, {
      modules: [Navigation, Pagination],
      loop: true,
      slidesPerView: 1,
      spaceBetween: 20,
      navigation: {
        nextEl: el.querySelector('.swiper-button-next'),
        prevEl: el.querySelector('.swiper-button-prev'),
      },
      pagination: {
        el: el.querySelector('.swiper-pagination'),
        clickable: true,
      },
    });
  });
}

export function initLightbox() {
  GLightbox({
    selector: '.embla-spotlight',
    touchNavigation: true,
    loop: true,
    openEffect: 'fade',
    closeEffect: 'fade',
    slideEffect: 'slide',
    slideDuration: 420,
    skin: 'hamon'
  });
}
