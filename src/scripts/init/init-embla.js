// public/scripts/init/init-embla.js
// Init Embla Carousel with parallax and controls
(function () {
  const TWEEN_FACTOR_BASE = 0.2;
  let tweenFactor = 0;
  let tweenNodes = [];

  function setTweenNodes(emblaApi) {
    tweenNodes = emblaApi.slideNodes().map((slideNode) =>
      slideNode.querySelector('.embla__parallax__layer')
    );
  }

  function setTweenFactor(emblaApi) {
    tweenFactor = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }

  function tweenParallax(emblaApi, eventName) {
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
  }

  // Attempts to get EmblaCarousel constructor:
  // 1) global window.EmblaCarousel
  // 2) dynamic import('embla-carousel') and reject if unavailable
  function getEmblaModule() {
    if (typeof window !== 'undefined' && window.EmblaCarousel) {
      return Promise.resolve({ default: window.EmblaCarousel });
    }
    return import('embla-carousel').catch(() => {
      console.warn('embla-carousel dynamic import failed; ensure embla is bundled or available globally.');
      return Promise.reject(new Error('embla not available'));
    });
  }

  function initEmbla(root) {
    root = root || document;
    return getEmblaModule()
      .then((mod) => {
        const EmblaCarousel = mod.default || mod;
        const emblaNodes = root instanceof Element ? [root] : Array.from(root.querySelectorAll('.embla'));
        emblaNodes.forEach((emblaNode) => {
          if (emblaNode.dataset && emblaNode.dataset.emblaInit === 'true') return;
          if (emblaNode.dataset) emblaNode.dataset.emblaInit = 'true';

          const viewportNode = emblaNode.querySelector('.embla__viewport');
          if (!viewportNode) return;

          const prevBtn = emblaNode.querySelector('.embla__button--prev');
          const nextBtn = emblaNode.querySelector('.embla__button--next');
          const dotsNode = emblaNode.querySelector('.embla__dots');

          const embla = EmblaCarousel(viewportNode, {
            loop: true,
            align: 'center'
          });

          // Parallax
          setTweenNodes(embla);
          setTweenFactor(embla);
          tweenParallax(embla);

          embla
            .on('reInit', () => setTweenNodes(embla))
            .on('reInit', () => setTweenFactor(embla))
            .on('reInit', () => tweenParallax(embla))
            .on('scroll', () => tweenParallax(embla, 'scroll'))
            .on('slideFocus', () => tweenParallax(embla));

          // Buttons
          const disablePrevAndNextBtns = () => {
            if (!prevBtn || !nextBtn) return;
            prevBtn.disabled = !embla.canScrollPrev();
            nextBtn.disabled = !embla.canScrollNext();
          };
          prevBtn && prevBtn.addEventListener('click', () => embla.scrollPrev(), false);
          nextBtn && nextBtn.addEventListener('click', () => embla.scrollNext(), false);
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
      })
      .catch((err) => {
        console.warn('initEmbla skipped: ', err);
      });
  }

  // Expose on window for main.js to call
  window.initEmbla = initEmbla;
})();
