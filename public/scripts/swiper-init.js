import Swiper from 'swiper';
import 'swiper/css';

document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.hamon-swiper');
  if (!el) return;

  new Swiper('.hamon-swiper', {
    loop: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: 80,
    speed: 700,
    navigation: {
      nextEl: '.hamon-swiper .swiper-button-next',
      prevEl: '.hamon-swiper .swiper-button-prev',
    },
    pagination: {
      el: '.hamon-swiper .swiper-pagination',
      clickable: true,
    },
    effect: 'coverflow',
    coverflowEffect: {
      rotate: 8,
      stretch: 0,
      depth: 150,
      modifier: 1,
      slideShadows: true,
    },
    breakpoints: {
      1024: { slidesPerView: 'auto', spaceBetween: 60 },
      640: { slidesPerView: 1.5, spaceBetween: 30 },
      0: { slidesPerView: 1.2, spaceBetween: 20 },
    },
  });
});
