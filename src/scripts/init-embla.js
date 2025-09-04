// src/scripts/init-embla.js
import EmblaCarousel from 'embla-carousel';
import { initLightbox } from './init-swiper-glightbox.js';

export function initEmbla(root = document) {
  const emblaNodes = (root instanceof Element)
    ? [root]
    : Array.from(root.querySelectorAll('.embla'));

  if (!emblaNodes.length) return;

  emblaNodes.forEach((emblaNode) => {
    if (emblaNode.dataset.emblaInit === 'true') return;
    emblaNode.dataset.emblaInit = 'true';

    const viewportNode = emblaNode.querySelector('.embla__viewport');
    if (!viewportNode) return;

    const embla = EmblaCarousel(viewportNode, {
      loop: true,
      align: 'center',
      containScroll: false,
      skipSnaps: false,
      inViewThreshold: 0.6,
      speed: 25
    });

    const slides = embla.slideNodes();
    const snaps = embla.scrollSnapList();

    // --- Opacité selon proximité ---
    const updateOpacityStates = () => {
      const selected = embla.selectedScrollSnap();
      const total = snaps.length;
      slides.forEach((slide, i) => {
        slide.classList.remove('is-selected', 'is-near');
        const diff = Math.min(Math.abs(i - selected), total - Math.abs(i - selected));
        if (diff === 0) slide.classList.add('is-selected');
        else if (diff === 1) slide.classList.add('is-near');
      });
    };

    // --- Événements Embla ---
    embla.on('select', updateOpacityStates);
    embla.on('resize', updateOpacityStates);

    // Premier rendu
    updateOpacityStates();

    // Navigation
    emblaNode.querySelector('.embla__prev')?.addEventListener('click', embla.scrollPrev);
    emblaNode.querySelector('.embla__next')?.addEventListener('click', embla.scrollNext);

    // Pagination
    const dotsNode = emblaNode.querySelector('.embla__dots');
    if (dotsNode) {
      const dots = snaps.map(() => {
        const b = document.createElement('button');
        b.classList.add('embla__dot');
        dotsNode.appendChild(b);
        b.addEventListener('click', () => embla.scrollTo(dots.indexOf(b)));
        return b;
      });
      const setSelectedDot = () => {
        const selectedIndex = embla.selectedScrollSnap();
        dots.forEach((dot, i) => dot.classList.toggle('is-selected', i === selectedIndex));
      };
      embla.on('select', setSelectedDot);
      setSelectedDot();
    }

    // Autoplay
    const AUTOPLAY_DELAY = 5000;
    let autoplayId = null;
    const startAutoplay = () => {
      stopAutoplay();
      autoplayId = setInterval(() => embla.scrollNext(), AUTOPLAY_DELAY);
    };
    const stopAutoplay = () => {
      if (autoplayId) {
        clearInterval(autoplayId);
        autoplayId = null;
      }
    };
    startAutoplay();
    emblaNode.addEventListener('mouseenter', stopAutoplay);
    emblaNode.addEventListener('mouseleave', startAutoplay);

    // Lightbox après init
    embla.on('init', () => {
      initLightbox();
    });

    if (typeof embla.init === 'function') {
      embla.init();
    }
  });
}
