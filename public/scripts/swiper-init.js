document.addEventListener('DOMContentLoaded', () => {
  // Init Swiper
  const hamonSwiper = new Swiper('.hamon-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    speed: 500,
    navigation: {
      nextEl: '.hamon-swiper .swiper-button-next',
      prevEl: '.hamon-swiper .swiper-button-prev'
    },
    pagination: {
      el: '.hamon-swiper .swiper-pagination',
      clickable: true
    }
  });

  // Init GLightbox
  const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    zoomable: true,
    openEffect: 'fade',
    closeEffect: 'fade'
  });
});
