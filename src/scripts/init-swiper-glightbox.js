import Swiper from 'swiper';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';
import GLightbox from 'glightbox';

export function initSwipers() {
  const swiperEls = document.querySelectorAll('.swiper');

  swiperEls.forEach((el) => {
    // 🎯 Cas spécial : slider section 2 (fade + autoplay)
    if (el.classList.contains('swiper-section2')) {
      new Swiper(el, {
        modules: [EffectFade, Autoplay],
        effect: 'fade',
        fadeEffect: { crossFade: true },
        loop: true,
        autoplay: {
          delay: 3500, // ⬅️ délai entre deux images (ms) — ici 3,5s au lieu de 5s
          disableOnInteraction: false
        },
        speed: 1600 // ⬅️ durée du fondu (ms) — plus grand = plus smooth
      });
      return;
    }

    // ⚙️ Config par défaut pour les autres sliders
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
