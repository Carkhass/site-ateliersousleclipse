import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';

export function initSwipers() {
  document.querySelectorAll('.swiper').forEach(swiperEl => {

    // Carrousel Hamon — effet parallaxe fluide
    if (swiperEl.classList.contains('hamon-swiper')) {
      new Swiper(swiperEl, {
        loop: true,
        slidesPerView: 1,
        speed: 1000,
        parallax: true,
        grabCursor: true,
        navigation: {
          nextEl: '.hamon-swiper .swiper-button-next',
          prevEl: '.hamon-swiper .swiper-button-prev'
        },
        pagination: {
          el: '.hamon-swiper .swiper-pagination',
          clickable: true
        }
      });
      return;
    }

    // Autres sliders
    new Swiper(swiperEl, {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: { el: '.swiper-pagination', clickable: true }
    });
  });
}

export function initLightbox() {
  const lb = GLightbox({
    selector: '.embla-spotlight',      // uniquement les images du carrousel
    touchNavigation: true,
    loop: true,
    openEffect: 'fade',
    closeEffect: 'fade',
    slideEffect: 'slide',
    slideDuration: 420,
    skin: 'hamon'                      // ajoute .glightbox-hamon au container
  });

  // Parallaxe pointeur + Ken Burns (subtils)
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const listeners = new WeakMap();

  const cleanup = (slide) => {
    if (!slide) return;
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
    if (!slide) return;
    const img = slide.querySelector('.gslide-image img, .gslide-image picture img');
    const frame = slide.querySelector('.gslide-image');
    if (!img || !frame) return;

    // Ken Burns très léger par défaut
    img.classList.add('glb-ken');

    if (isCoarse) return; // pas de parallaxe sur tactile

    // Parallaxe pointeur (amplitude faible)
    const AMPLITUDE = 12; // px
    const onMove = (e) => {
      const rect = frame.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5..0.5
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
    // Sécurise l’état initial si le premier 'slide_changed' tarde
    const current = document.querySelector('.glightbox-container .gslide.current');
    enhanceSlide(current);
  });

  lb.on('close', () => {
    document.querySelectorAll('.glightbox-container .gslide').forEach(cleanup);
  });

  // Expose (debug éventuel)
  window.__glb = lb;
}