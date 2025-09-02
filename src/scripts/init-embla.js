import EmblaCarousel from 'embla-carousel';

export function initEmbla() {
  const emblaNode = document.querySelector('.embla');
  if (!emblaNode) return;

  const viewportNode = emblaNode.querySelector('.embla__viewport');
  const embla = EmblaCarousel(viewportNode, {
    loop: true,
    align: 'center',
    containScroll: false,
    skipSnaps: false,
    inViewThreshold: 0.6
  });

  const slides = embla.slideNodes();
  const snaps = embla.scrollSnapList();
  const images = emblaNode.querySelectorAll('.embla__parallax__img');

  // Gestion opacité des slides
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

  // Effet parallaxe
  const applyParallax = () => {
    const viewportRect = viewportNode.getBoundingClientRect();
    const viewportCenter = viewportRect.left + viewportRect.width / 2;
    const isContain = emblaNode.classList.contains('mode-contain');

    images.forEach((img) => {
      const slideRect = img.closest('.embla__slide').getBoundingClientRect();
      const slideCenter = slideRect.left + slideRect.width / 2;
      const distanceFromCenter = slideCenter - viewportCenter;
      const translate = distanceFromCenter * (isContain ? -0.25 : -0.12);
      img.style.transform = `translateX(${translate}px)` +
        (emblaNode.classList.contains('mode-cover') ? ' scale(1.02)' : '');
    });
  };

  embla.on('scroll', applyParallax);
  embla.on('select', () => {
    updateOpacityStates();
    applyParallax();
  });
  embla.on('resize', () => {
    updateOpacityStates();
    applyParallax();
  });

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

  // Autoplay simple
  const AUTOPLAY_DELAY = 4000;
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

  // Pause autoplay au survol
  emblaNode.addEventListener('mouseenter', stopAutoplay);
  emblaNode.addEventListener('mouseleave', startAutoplay);
}
