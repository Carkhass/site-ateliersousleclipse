// src/scripts/init-embla.js
console.debug('[src init-embla] loaded', new Date().toISOString());

import EmblaCarousel from 'embla-carousel';

const TWEEN_FACTOR_BASE = 0.2;
let tweenFactor = 0;
let tweenNodes = [];

const setTweenNodes = (emblaApi) => {
  tweenNodes = emblaApi.slideNodes().map((slideNode) =>
    slideNode.querySelector('.embla__parallax__layer')
  );
};

const setTweenFactor = (emblaApi) => {
  tweenFactor = TWEEN_FACTOR_BASE * (emblaApi.scrollSnapList().length || 1);
};

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

      if (engine.options && engine.options.loop) {
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

export function initEmbla(root = document) {
  const emblaNodes = root instanceof Element ? [root] : Array.from(root.querySelectorAll('.embla'));

  emblaNodes.forEach((emblaNode) => {
    // If already marked fully initialised, skip
    if (emblaNode.dataset && emblaNode.dataset.emblaInit === 'true') return;

    const viewportNode = emblaNode.querySelector('.embla__viewport');
    if (!viewportNode) return;

    const prevBtn = emblaNode.querySelector('.embla__button--prev');
    const nextBtn = emblaNode.querySelector('.embla__button--next');
    const dotsNode = emblaNode.querySelector('.embla__dots');

    // Create Embla instance
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

    // Expose instance for debug/control (dev only)
    window._emblaAPIs = window._emblaAPIs || [];
    window._emblaAPIs.push(embla);

    // Parallax setup
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

    // Robust updateButtonsState: remove disabled when embla reports can scroll
    const updateButtonsState = () => {
      if (!prevBtn || !nextBtn) return;
      try {
        const canPrev = !!embla.canScrollPrev && embla.canScrollPrev();
        const canNext = !!embla.canScrollNext && embla.canScrollNext();

        if (canPrev) prevBtn.removeAttribute('disabled');
        if (canNext) nextBtn.removeAttribute('disabled');

        prevBtn.disabled = !canPrev;
        nextBtn.disabled = !canNext;

        prevBtn.classList.toggle('is-disabled', !canPrev);
        nextBtn.classList.toggle('is-disabled', !canNext);
      } catch (e) {
        // embla not ready yet; will retry via scheduled checks
      }
    };

    // Wire buttons with closures for safe binding
    if (prevBtn) prevBtn.addEventListener('click', () => embla.scrollPrev(), false);
    if (nextBtn) nextBtn.addEventListener('click', () => embla.scrollNext(), false);

    // Ensure update triggers on events
    embla.on('select', updateButtonsState).on('init', updateButtonsState).on('reInit', updateButtonsState);

    // Initial and delayed rechecks to cover layout/images timing
    updateButtonsState();
    Promise.resolve().then(updateButtonsState);
    setTimeout(updateButtonsState, 60);
    setTimeout(() => { try { embla.reInit && embla.reInit(); } catch (e) {} updateButtonsState(); }, 240);
    setTimeout(updateButtonsState, 600);

    // Final sanity cleanup: if Embla reports canScroll but attribute remains, remove it
    setTimeout(() => {
      try {
        if (embla.canScrollNext && embla.canScrollNext()) nextBtn && nextBtn.removeAttribute('disabled');
        if (embla.canScrollPrev && embla.canScrollPrev()) prevBtn && prevBtn.removeAttribute('disabled');
      } catch (e) {}
    }, 800);

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
          dots.forEach((dot, i) => dot.classList.toggle('embla__dot--selected', i === selected));
        };
        dots.forEach((dot, i) => dot.addEventListener('click', () => embla.scrollTo(i)));
        embla.on('select', setSelectedDotBtn).on('init', setSelectedDotBtn);
      };
      addDotBtnsAndClickHandlers();
      embla.on('reInit', addDotBtnsAndClickHandlers);
    }

    // Wait for images if present, then reInit+update
    const imgs = viewportNode.querySelectorAll('img');
    let remaining = 0;
    if (imgs && imgs.length) {
      remaining = imgs.length;
      imgs.forEach((img) => {
        if (img.complete) {
          remaining--;
        } else {
          img.addEventListener('load', () => {
            remaining--;
            if (remaining <= 0) {
              setTimeout(() => { embla.reInit && embla.reInit(); updateButtonsState(); }, 40);
            }
          }, { once: true });
          img.addEventListener('error', () => {
            remaining--;
            if (remaining <= 0) {
              setTimeout(() => { embla.reInit && embla.reInit(); updateButtonsState(); }, 40);
            }
          }, { once: true });
        }
      });
      if (remaining <= 0) {
        setTimeout(() => { embla.reInit && embla.reInit(); updateButtonsState(); }, 40);
      }
    } else {
      // No images: small deferred recheck
      setTimeout(() => { embla.reInit && embla.reInit(); updateButtonsState(); }, 10);
    }

    // Window-level rechecks and mark inited after stabilization
    function ensureReadyAndUpdate() {
      try { embla.reInit && embla.reInit(); } catch (e) {}
      setTweenNodes(embla);
      setTweenFactor(embla);
      tweenParallax(embla);
      updateButtonsState();
    }

    window.addEventListener('load', () => setTimeout(ensureReadyAndUpdate, 50));
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ensureReadyAndUpdate(), 140);
    });

    // Mark as initialised only after a small stabilization window
    setTimeout(() => {
      try { embla.reInit && embla.reInit(); } catch (e) {}
      updateButtonsState();
      if (emblaNode.dataset) emblaNode.dataset.emblaInit = 'true';
    }, 160);
  });
}
