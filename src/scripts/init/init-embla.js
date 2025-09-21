// src/scripts/init/init-embla.js

const TWEEN_FACTOR_BASE = 0.2;
let tweenFactor = 0;
let tweenNodes = [];

const setTweenNodes = (emblaApi) =>
  (tweenNodes = emblaApi.slideNodes().map((slideNode) =>
    slideNode.querySelector('.embla__parallax__layer')
  ));

const setTweenFactor = (emblaApi) =>
  (tweenFactor = TWEEN_FACTOR_BASE * (emblaApi.scrollSnapList().length || 1));

const tweenParallax = (emblaApi, eventName) => {
  const engine = emblaApi.internalEngine();
  const scrollProgress = emblaApi.scrollProgress();
  const slidesInView = emblaApi.slidesInView();
  const isScrollEvent = eventName === 'scroll';

  emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
    let diffToTarget = scrollSnap - scrollProgress;
    const slidesInSnap = engine.slideRegistry[snapIndex] || [];

    slidesInSnap.forEach((slideIndex) => {
      if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

      if (engine.options?.loop) {
        (engine.slideLooper?.loopPoints || []).forEach((loopItem) => {
          const target = loopItem.target();
          if (slideIndex === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
          }
        });
      }

      const translate = diffToTarget * (-1 * tweenFactor) * 100;
      const tweenNode = tweenNodes[slideIndex];
      if (tweenNode) tweenNode.style.transform = `translateX(${translate}%)`;
    });
  });
};

// --- Gestion des boutons ---
function setupPrevNextBtns(prevBtn, nextBtn, embla) {
  if (!prevBtn || !nextBtn) return;

  const updateButtonsState = () => {
    const canPrev = embla.canScrollPrev();
    const canNext = embla.canScrollNext();
    prevBtn.disabled = !canPrev;
    nextBtn.disabled = !canNext;
    prevBtn.classList.toggle('is-disabled', !canPrev);
    nextBtn.classList.toggle('is-disabled', !canNext);
  };

  prevBtn.addEventListener('click', () => embla.scrollPrev(), false);
  nextBtn.addEventListener('click', () => embla.scrollNext(), false);

  embla.on('select', updateButtonsState).on('reInit', updateButtonsState);
  updateButtonsState(); // état initial
}

// --- Gestion des dots ---
function setupDotBtns(embla, dotsNode) {
  if (!dotsNode) return;

  dotsNode.innerHTML = ''; // reset
  const dots = embla.scrollSnapList().map((_, index) => {
    const button = document.createElement('button');
    button.className = 'embla__dot';
    button.type = 'button';
    button.addEventListener('click', () => embla.scrollTo(index), false);
    dotsNode.appendChild(button);
    return button;
  });

  const updateSelectedDot = () => {
    const previous = embla.previousScrollSnap();
    const selected = embla.selectedScrollSnap();
    if (dots[previous]) dots[previous].classList.remove('embla__dot--selected');
    if (dots[selected]) dots[selected].classList.add('embla__dot--selected');
  };

  embla.on('select', updateSelectedDot).on('reInit', updateSelectedDot);
  updateSelectedDot();
}

/**
 * Initialise Embla sur un élément racine donné.
 * @param {HTMLElement} root - Élément racine .embla
 * @param {Function} EmblaCarousel - Constructeur Embla importé dans le composant Astro
 */
export function initEmbla(root, EmblaCarousel) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (!root) return;
  if (root.dataset?.emblaInit === 'true') return;

  const viewportNode = root.querySelector('.embla__viewport');
  if (!viewportNode) return;

  const prevBtn = root.querySelector('.embla__button--prev');
  const nextBtn = root.querySelector('.embla__button--next');
  const dotsNode = root.querySelector('.embla__dots');

  let embla;
  try {
    embla = EmblaCarousel(viewportNode, {
      loop: true,
      align: 'center',
      containScroll: 'trimSnaps'
    });
  } catch (e) {
    console.warn('Embla init failed for node', root, e);
    return;
  }

  root.dataset.emblaInit = 'true';
  window._emblaAPIs = window._emblaAPIs || [];
  window._emblaAPIs.push(embla);

  setTweenNodes(embla);
  setTweenFactor(embla);
  tweenParallax(embla);

  embla
    .on('reInit', () => {
      setTweenNodes(embla);
      setTweenFactor(embla);
      tweenParallax(embla);
    })
    .on('scroll', () => tweenParallax(embla, 'scroll'))
    .on('slideFocus', () => tweenParallax(embla));

  // Active la gestion des boutons et des dots
  setupPrevNextBtns(prevBtn, nextBtn, embla);
  setupDotBtns(embla, dotsNode);
}
