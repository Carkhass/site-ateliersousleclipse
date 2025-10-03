// src/scripts/init/init-swiper-glightbox.js
export async function initSwipers(root) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const container = root && root.querySelectorAll ? root : document;

  const { default: Swiper } = await import('swiper');
  const { Navigation, Pagination, EffectFade, Autoplay } = await import('swiper/modules');

  const swiperEls = container.querySelectorAll('.swiper');
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

    new Swiper(el, {
      modules: [Navigation, Pagination],
      loop: true,
      slidesPerView: 1,
      centeredSlides: false,
      spaceBetween: 20,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    });
  });
}

export async function initLightbox() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const { default: GLightbox } = await import('glightbox');

  // 1) Lightbox existante pour spotlight/hamon
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

  // 2) Lightbox pour les sliders couteaux
  document.querySelectorAll('.container-knife-gallery > .grid').forEach((col) => {
    const main = col.querySelector('.embla-knife-main');
    const thumbs = col.querySelector('.embla-knife-thumbs');
    if (!main) return;

    // Collecte des images du slider principal
    const slidesImgs = Array.from(main.querySelectorAll('.embla-knife-slide img')).map((img) => ({
      href: img.dataset.full || img.src,
      title: img.dataset.title || img.alt || '', // 👉 légende dynamique
      type: 'image'
    }));

    // Index courant basé sur la vignette active
    const getCurrentIndex = () => {
      if (!thumbs) return 0;
      const slides = Array.from(thumbs.querySelectorAll('.embla-knife-slide'));
      const selected = thumbs.querySelector('.embla-knife-slide.is-selected');
      const idx = selected ? slides.indexOf(selected) : 0;
      return Math.max(0, idx);
    };

    // Ouverture uniquement quand on clique dans le slider principal
    main.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.closest('.embla-knife-slide img')) return;

      const startAt = getCurrentIndex();
      const lightbox = GLightbox({
        elements: slidesImgs,
        startAt,
        touchNavigation: true,   // 👉 swipe mobile
        keyboardNavigation: true, // 👉 flèches gauche/droite desktop
        loop: true,
        openEffect: 'fade',
        closeEffect: 'fade',
        slideEffect: 'slide',
        slideDuration: 420,
        skin: 'hamon'
      });

      lightbox.open();
    });
  });
}


