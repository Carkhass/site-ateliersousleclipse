document.addEventListener('DOMContentLoaded', () => {
  const swiperEl = document.querySelector('.hamon-swiper');
  if (!swiperEl) return;

  const hamonSwiper = new Swiper('.hamon-swiper', {
    loop: true,
    centeredSlides: true,
    slidesPerView: 'auto', // largeur fixée par CSS sur desktop
    spaceBetween: 80,
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
      rotate: 8,      // rotation légère
      stretch: 0,
      depth: 150,     // profondeur 3D
      modifier: 1,
      slideShadows: true
    },

    // 📱 Réglages responsive
    breakpoints: {
      // Tablettes et + (>= 1024px)
      1024: {
        slidesPerView: 'auto', // conserve l'affichage des slides latérales
        spaceBetween: 60
      },
      // Mobiles (< 1024px et >= 640px)
      640: {
        slidesPerView: 1.5, // 1 slide entière + un bout de la suivante
        spaceBetween: 30
      },
      // Petits mobiles (< 640px)
      0: {
        slidesPerView: 1.2, // 1 slide entière + un petit aperçu
        spaceBetween: 20
      }
    }
  });

  // Initialisation de GLightbox si dispo
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
