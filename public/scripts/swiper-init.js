document.addEventListener('DOMContentLoaded', () => {
  const swiperEl = document.querySelector('.hamon-swiper');
  if (!swiperEl) return;

  const hamonSwiper = new Swiper('.hamon-swiper', {
    loop: true,
    centeredSlides: true,
    slidesPerView: 'auto', // largeur fixée par CSS = contrôle total
    spaceBetween: 80,      // un peu plus d’air
    speed: 700,

    navigation: {
      nextEl: '.hamon-swiper .swiper-button-next',
      prevEl: '.hamon-swiper .swiper-button-prev'
    },
    pagination: {
      el: '.hamon-swiper .swiper-pagination',
      clickable: true
    },

    effect: 'coverflow',
    coverflowEffect: {
      rotate: 8,      // rotation très légère
      stretch: 0,
      depth: 150,     // profondeur plus prononcée
      modifier: 1,
      slideShadows: true
    }
  });

  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
      zoomable: true,
      openEffect: 'fade',
      closeEffect: 'fade'
    });
  }
});
