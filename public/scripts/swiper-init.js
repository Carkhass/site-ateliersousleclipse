// Import Swiper depuis node_modules
import Swiper from 'swiper';
import 'swiper/css';

// Initialisation Swiper une fois le DOM prêt
document.addEventListener('DOMContentLoaded', () => {
  const swipers = document.querySelectorAll('.swiper');

  swipers.forEach(swiperEl => {
    new Swiper(swiperEl, {
      slidesPerView: 'auto',
      spaceBetween: 20,
      loop: true,
      centeredSlides: true,
      grabCursor: true,
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  });
});
