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

  // Autoplay continu maison
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

  // Spotlight interactif
  const lightbox = document.getElementById('emblaLightbox');
  const lightboxImg = document.getElementById('emblaLightboxImg');
  const lightboxBg = lightbox?.querySelector('.embla-lightbox__bg');
  const lightboxClose = document.getElementById('emblaLightboxClose');

  let originRect = null;

  const openLightboxFromSlide = (slideEl) => {
    const img = slideEl.querySelector('.embla__parallax__img');
    if (!img || !lightbox || !lightboxImg || !lightboxBg || !lightboxClose) return;

    // Active le lightbox d'abord
    lightbox.classList.add('active');
    stopAutoplay();

    // Recalcule la position exacte après activation
    originRect = img.getBoundingClientRect();
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.style.top = originRect.top + 'px';
    lightboxImg.style.left = originRect.left + 'px';
    lightboxImg.style.width = originRect.width + 'px';
    lightboxImg.style.height = 'auto';
    lightboxImg.style.transform = 'scale(1)';

    // Zoom fluide ×2
    requestAnimationFrame(() => {
      lightboxImg.style.top = '50%';
      lightboxImg.style.left = '50%';
      lightboxImg.style.transform = 'translate(-50%, -50%) scale(2)';
    });
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg || !lightboxBg) return;

    let targetRect = originRect;
    if (!targetRect) {
      const selectedImg = document.querySelector('.embla__slide.is-selected .embla__parallax__img');
      if (selectedImg) targetRect = selectedImg.getBoundingClientRect();
    }
    if (!targetRect) {
      lightbox.classList.remove('active');
      lightboxImg.removeAttribute('style');
      lightboxImg.src = '';
      originRect = null;
      startAutoplay();
      return;
    }

    // Retour à la position d'origine
    lightboxImg.style.top = targetRect.top + 'px';
    lightboxImg.style.left = targetRect.left + 'px';
    lightboxImg.style.width = targetRect.width + 'px';
    lightboxImg.style.height = 'auto';
    lightboxImg.style.transform = 'scale(1)';

    setTimeout(() => {
      lightbox.classList.remove('active');
      lightboxImg.removeAttribute('style');
      lightboxImg.src = '';
      originRect = null;
      startAutoplay();
    }, 400);
  };

  // Ouvrir au clic sur la slide centrale
  slides.forEach((slide) => {
    slide.addEventListener('click', () => {
      if (slide.classList.contains('is-selected')) {
        openLightboxFromSlide(slide);
      }
    });
  });

  // Fermer
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightboxBg) closeLightbox();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('active')) {
      closeLightbox();
    }
  });
}
