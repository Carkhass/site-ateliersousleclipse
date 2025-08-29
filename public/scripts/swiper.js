window.addEventListener('load', () => {
  console.log('✅ Événement window.load : tout le DOM + assets sont prêts');

  // Vérification 1 : Swiper est-il bien disponible ?
  if (typeof Swiper === 'undefined') {
    console.error('❌ Swiper NON chargé');
    return;
  } else {
    console.log('✅ Swiper est chargé');
  }

  // Vérification 2 : GLightbox est-il bien disponible ?
  if (typeof GLightbox === 'undefined') {
    console.error('❌ GLightbox NON chargé');
    return;
  } else {
    console.log('✅ GLightbox est chargé');
  }

  // Vérification 3 : présence du conteneur slider
  const swiperEl = document.querySelector('.hamon-swiper');
  if (!swiperEl) {
    console.error('❌ Élément .hamon-swiper introuvable dans le DOM');
    return;
  } else {
    console.log(`✅ Élément .hamon-swiper trouvé avec ${swiperEl.querySelectorAll('.swiper-slide').length} slides`);
  }

  // --- Init Swiper ---
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
  console.log('✅ Swiper initialisé');

  // --- Init GLightbox ---
  const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    zoomable: true,
    openEffect: 'fade',
    closeEffect: 'fade'
  });
  console.log('✅ GLightbox initialisé');
});
