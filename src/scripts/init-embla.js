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
      speed: 25 // plus lent = plus smooth
    });

    const slides = embla.slideNodes();
    const snaps = embla.scrollSnapList();
    const images = emblaNode.querySelectorAll('.embla__parallax__img');

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

    // --- Parallaxe fluide + boost centrale ---
    const currentMap = new WeakMap();
    const lerp = (start, end, t) => start + (end - start) * t;
    let ticking = false;

    const applyParallax = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const viewportRect = viewportNode.getBoundingClientRect();
        const viewportCenter = viewportRect.left + viewportRect.width / 2;
        const isContain = emblaNode.classList.contains('mode-contain');
        const selectedIndex = embla.selectedScrollSnap();
        const progress = embla.scrollProgress();

        images.forEach((img, index) => {
          const slideRect = img.closest('.embla__slide').getBoundingClientRect();
          const slideCenter = slideRect.left + slideRect.width / 2;
          const distanceFromCenter = slideCenter - viewportCenter;

          // Facteur de base plus ample
          let targetTranslate = distanceFromCenter * (isContain ? -0.14 : -0.12);

          // BOOST x3 pour la centrale
          if (index === selectedIndex) {
            const localProgress = Math.abs(progress % 1);
            const boost = (localProgress > 0.5 ? 1 - localProgress : localProgress) * 90; // px max
            targetTranslate += (distanceFromCenter >= 0 ? boost : -boost);
          }

          // Interpolation douce
          const prev = currentMap.get(img) ?? 0;
          const smooth = lerp(prev, targetTranslate, 0.15);
          currentMap.set(img, smooth);

          // Zoom progressif
          const maxZoom = 1.05;
          const minZoom = 1.00;
          const zoom = maxZoom - (Math.abs(distanceFromCenter) / viewportRect.width) * (maxZoom - minZoom);

          img.style.transform = `translateX(${smooth}px) scale(${zoom})`;
        });

        ticking = false;
      });
    };

    // --- Événements Embla ---
    embla.on('scroll', applyParallax);
    embla.on('select', () => {
      updateOpacityStates();
      applyParallax();
    });
    embla.on('resize', () => {
      updateOpacityStates();
      applyParallax();
    });

    // Premier rendu
    updateOpacityStates();
    applyParallax();

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
