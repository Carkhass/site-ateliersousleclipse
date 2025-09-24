// src/scripts/animations/reveal-on-scroll.js
// Gère toutes les animations d'apparition au scroll
export function initRevealOnScroll() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const animationSelectors = [
    '[class*="fade-slide-"]',
    '.fade-in',
    '.slide-up',
    '.reveal-on-scroll',
    '.animate-on-scroll',
    '.fade-in-up',
    '.fade-in-delay'
  ];

  const observedElements = new Set();
  const observerOptions = { threshold: 0.1 };

  const onIntersect = (entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  };

  const revealObserver = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(onIntersect, observerOptions)
    : null;

  function observeNewElements(root) {
    const container = root && root.querySelectorAll ? root : document;
    container.querySelectorAll(animationSelectors.join(',')).forEach(el => {
      if (!observedElements.has(el)) {
        observedElements.add(el);
        if (revealObserver) {
          revealObserver.observe(el);
        } else {
          el.classList.add('visible');
        }
      }
    });
  }

  function revealIfInViewport(root) {
    const container = root && root.querySelectorAll ? root : document;
    container.querySelectorAll(animationSelectors.join(',')).forEach(el => {
      if (el.classList.contains('visible')) return;
      const r = el.getBoundingClientRect();
      const inView = r.top < (window.innerHeight || document.documentElement.clientHeight) && r.bottom > 0;
      if (inView) {
        // 🔧 Patch : toujours déclencher avec un petit délai pour forcer l'anim
        setTimeout(() => el.classList.add('visible'), 150);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    observeNewElements();
    revealIfInViewport();

    // Cas particulier conservé: carte 3D premium sur desktop
    if (window.innerWidth >= 1024) {
      const cardWrapper = document.querySelector('.premium-section .card-3d-wrapper.fade-slide-up');
      if (cardWrapper) {
        const r = cardWrapper.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          setTimeout(() => cardWrapper.classList.add('visible'), 150);
        }
      }
    }

    // 🔧 Patch spécifique : forcer le logo et le titre du hero à jouer leur anim au chargement
    const heroEls = [document.getElementById("hero-logo"), document.getElementById("hero-title")];
    heroEls.forEach(el => {
      if (el) {
        el.classList.remove("visible"); // s'assurer qu'ils partent invisibles
        setTimeout(() => el.classList.add("visible"), 200); // déclenche l'anim
      }
    });
  });

  if (typeof MutationObserver !== 'undefined') {
    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            observeNewElements(node);
            revealIfInViewport(node);
          }
        });
      });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
  } else {
    setInterval(() => {
      observeNewElements();
      revealIfInViewport();
    }, 800);
  }
}
