// src/scripts/init-embla.js
import EmblaCarousel from 'embla-carousel';

const TWEEN_FACTOR_BASE = 0.2;
let tweenFactor = 0;
let tweenNodes = [];

const setTweenNodes = (emblaApi) => {
  tweenNodes = emblaApi.slideNodes().map((slideNode) => {
    return slideNode.querySelector('.embla__parallax__layer');
  });
};

const setTweenFactor = (emblaApi) => {
  tweenFactor = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
};

const tweenParallax = (emblaApi, eventName) => {
  const engine = emblaApi.internalEngine();
  const scrollProgress = emblaApi.scrollProgress();
  const slidesInView = emblaApi.slidesInView();
  const isScrollEvent = eventName === 'scroll';

  emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
    let diffToTarget = scrollSnap - scrollProgress;
    const slidesInSnap = engine.slideRegistry[snapIndex];

    slidesInSnap.forEach((slideIndex) => {
      if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
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
      if (tweenNode) {
        tweenNode.style.transform = `translateX(${translate}%)`;
      }
    });
  });
};

export function initEmbla(root = document) {
  const emblaNodes = (root instanceof Element)
    ? [root]
    : Array.from(root.querySelectorAll('.embla'));

  emblaNodes.forEach((emblaNode) => {
    if (emblaNode.dataset.emblaInit === 'true') return;
    emblaNode.dataset.emblaInit = 'true';

    const viewportNode = emblaNode.querySelector('.embla__viewport');
    if (!viewportNode) return;

    const prevBtn = emblaNode.querySelector('.embla__button--prev');
    const nextBtn = emblaNode.querySelector('.embla__button--next');
    const dotsNode = emblaNode.querySelector('.embla__dots');

    const embla = EmblaCarousel(viewportNode, {
      loop: true,
      align: 'center'
    });

    // Parallax setup
    setTweenNodes(embla);
    setTweenFactor(embla);
    tweenParallax(embla);

    embla
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenParallax)
      .on('scroll', tweenParallax)
      .on('slideFocus', tweenParallax);

    // Buttons
    const disablePrevAndNextBtns = () => {
      if (!prevBtn || !nextBtn) return;
      prevBtn.disabled = !embla.canScrollPrev();
      nextBtn.disabled = !embla.canScrollNext();
    };
    prevBtn?.addEventListener('click', embla.scrollPrev, false);
    nextBtn?.addEventListener('click', embla.scrollNext, false);
    embla.on('select', disablePrevAndNextBtns).on('init', disablePrevAndNextBtns);

    // Dots
    if (dotsNode) {
      const addDotBtnsAndClickHandlers = () => {
        dotsNode.innerHTML = '';
        const scrollSnaps = embla.scrollSnapList();
        const dots = scrollSnaps.map(() => {
          const button = document.createElement('button');
          button.classList.add('embla__dot');
          dotsNode.appendChild(button);
          return button;
        });
        const setSelectedDotBtn = () => {
          const selected = embla.selectedScrollSnap();
          dots.forEach((dot, i) => {
            dot.classList.toggle('embla__dot--selected', i === selected);
          });
        };
        dots.forEach((dot, i) => dot.addEventListener('click', () => embla.scrollTo(i)));
        embla.on('select', setSelectedDotBtn).on('init', setSelectedDotBtn);
      };
      addDotBtnsAndClickHandlers();
      embla.on('reInit', addDotBtnsAndClickHandlers);
    }
  });
}
