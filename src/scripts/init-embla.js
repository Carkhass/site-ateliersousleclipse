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
  embla.on('select', () => { updateOpacityStates(); applyParallax(); });
  embla.on('resize', () => { updateOpacityStates(); applyParallax(); });

  updateOpacityStates();
  applyParallax();

  emblaNode.querySelector('.embla__prev')?.addEventListener('click', embla.scrollPrev);
  emblaNode.querySelector('.embla__next')?.addEventListener('click', embla.scrollNext);

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

  // Autoplay continu maison
  const AUTOPLAY_DELAY = 4000;
  setInterval(() => {
    embla.scrollNext();
  }, AUTOPLAY_DELAY);
}

// Lightbox morphing
const lightbox = document.getElementById('emblaLightbox');
const lightboxImg = document.getElementById('emblaLightboxImg');
const lightboxBg = lightbox.querySelector('.embla-lightbox__bg');
const lightboxClose = document.getElementById('emblaLightboxClose');

slides.forEach((slide) => {
  slide.addEventListener('click', () => {
    if (slide.classList.contains('is-selected')) {
      const img = slide.querySelector('.embla__parallax__img');
      const rect = img.getBoundingClientRect();

      // Position initiale = position dans le slider
      lightboxImg.src = img.src;
      lightboxImg.style.top = rect.top + 'px';
      lightboxImg.style.left = rect.left + 'px';
      lightboxImg.style.width = rect.width + 'px';
      lightboxImg.style.height = rect.height + 'px';
      lightboxImg.style.transform = 'scale(1)';

      lightbox.classList.add('active');

      // Forcer reflow pour déclencher la transition
      requestAnimationFrame(() => {
        lightboxImg.style.top = '50%';
        lightboxImg.style.left = '50%';
        lightboxImg.style.transform = 'translate(-50%, -50%) scale(2)';
        lightboxImg.style.width = rect.width * 2 + 'px';
        lightboxImg.style.height = rect.height * 2 + 'px';
      });
    }
  });
});

// Fermeture
function closeLightbox() {
  const rect = document.querySelector('.embla__slide.is-selected .embla__parallax__img').getBoundingClientRect();
  lightboxImg.style.top = rect.top + 'px';
  lightboxImg.style.left = rect.left + 'px';
  lightboxImg.style.width = rect.width + 'px';
  lightboxImg.style.height = rect.height + 'px';
  lightboxImg.style.transform = 'scale(1)';

  lightboxBg.style.opacity = '0';

  setTimeout(() => {
    lightbox.classList.remove('active');
    lightboxBg.style.opacity = '';
  }, 400);
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightboxBg) closeLightbox();
});
