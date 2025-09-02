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
  const targets = document.querySelectorAll('.embla-spotlight');
  console.log(`[GLB] Slides détectées : ${targets.length}`);

  if (!targets.length) {
    console.warn('[GLB] Aucune cible trouvée pour la lightbox.');
    return;
  }

  const lb = GLightbox({
    selector: '.embla-spotlight',
    touchNavigation: true,
    loop: true,
    openEffect: 'fade',
    closeEffect: 'fade',
    slideEffect: 'slide',
    slideDuration: 420,
    skin: 'hamon'
  });

  const isElement = (obj) => obj instanceof Element || obj instanceof HTMLDocument;

  lb.on('open', (instance) => {
    console.log('[GLB] Lightbox ouverte', instance);
  });

  lb.on('slide_changed', ({ slide, prev }) => {
    if (!isElement(slide)) return;
    console.log('[GLB] Slide changée', slide);
  });

  lb.on('close', () => {
    console.log('[GLB] Lightbox fermée');
  });

  window.__glb = lb;
}
