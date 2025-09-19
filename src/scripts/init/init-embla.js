// src/scripts/init/init-embla.js
import EmblaCarousel from 'embla-carousel';

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

export function initEmbla(root) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const emblaNodes =
    root && root.querySelectorAll
      ? [root]
      : Array.from(document.querySelectorAll('.embla'));

  emblaNodes.forEach((emblaNode) => {
    if (emblaNode.dataset?.emblaInit === 'true') return;

    const viewportNode = emblaNode.querySelector('.embla__viewport');
    if (!viewportNode) return;

    const prevBtn = emblaNode.querySelector('.embla__button--prev');
    const nextBtn = emblaNode.querySelector('.embla__button--next');
    const dotsNode = emblaNode.querySelector('.embla__dots');

    let embla;
    try {
      embla = EmblaCarousel(viewportNode, {
        loop: true,
        align: 'center',
        containScroll: 'trimSnaps'
      });
    } catch (e) {
      console.warn('Embla init failed for node', emblaNode, e);
      return;
    }

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

    const updateButtonsState = () => {
      if (!prevBtn || !nextBtn) return;
      const canPrev = embla.canScrollPrev();
      const canNext = embla.canScrollNext();
      prevBtn.disabled = !canPrev;
      nextBtn.disabled = !canNext;
      prevBtn.classList.toggle('is-disabled', !canPrev);
      nextBtn.classList.toggle('is-disabled', !canNext);
    };

    prevBtn?.addEventListener('click', () => embla.scrollPrev(), false);
    nextBtn?.addEventListener('click', () => embla.scrollNext(), false);

    embla.on('select', updateButtonsState).on('init', updateButtonsState);

    updateButtonsState();
  });
}
