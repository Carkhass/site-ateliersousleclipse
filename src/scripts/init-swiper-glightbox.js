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
  const lb = GLightbox({
    selector: '.embla-spotlight',
    touchNavigation: true,
    loop: true,
    openEffect: 'fade',
    closeEffect: 'fade',
    slideEffect: 'slide',
    slideDuration: 420,
    skin: 'hamon',
    svg: {
      next: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>',
      prev: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.41 7.41 10.83 12l4.58 4.59L14 18l-6-6 6-6z"/></svg>',
      close: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
    }
  });

  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const listeners = new WeakMap();
  const isElement = (obj) => obj instanceof Element || obj instanceof HTMLDocument;

  const cleanup = (slide) => {
    if (!isElement(slide)) return;
    const img = slide.querySelector('.gslide-image img, .gslide-image picture img');
    if (img) {
      img.style.transform = '';
      img.classList.remove('glb-ken');
    }
    const move = listeners.get(slide);
    if (move) {
      slide.removeEventListener('pointermove', move);
      slide.removeEventListener('pointerleave', move._leave);
      listeners.delete(slide);
    }
  };

  const enhanceSlide = (slide) => {
    if (!isElement(slide)) return;
    const img = slide.querySelector('.gslide-image img, .gslide-image picture img');
    const frame = slide.querySelector('.gslide-image');
    if (!img || !frame) return;

    img.classList.add('glb-ken');
    if (isCoarse) return;

    const AMPLITUDE = 12;
    const onMove = (e) => {
      const rect = frame.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      const tx = nx * AMPLITUDE * 2;
      const ty = ny * AMPLITUDE;
      img.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.03)`;
    };
    const onLeave = () => {
      img.style.transform = 'translate3d(0,0,0) scale(1)';
    };
    onMove._leave = onLeave;

    slide.addEventListener('pointermove', onMove);
    slide.addEventListener('pointerleave', onLeave);
    listeners.set(slide, onMove);
  };

  lb.on('slide_changed', ({ slide, prev }) => {
    cleanup(prev);
    enhanceSlide(slide);
  });

  lb.on('open', () => {
    const current = document.querySelector('.glightbox-container .gslide.current');
    enhanceSlide(current);
  });

  lb.on('close', () => {
    document.querySelectorAll('.glightbox-container .gslide').forEach(cleanup);
  });

  window.__glb = lb;
}
