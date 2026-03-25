// src/scripts/animations/reveal-on-scroll.js
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
  
  // 🔧 OPTIMISATION 1 : rootMargin à 50px
  // L'animation se déclenche 50px AVANT que l'élément n'entre dans l'écran. 
  // C'est beaucoup plus fluide pour l'utilisateur.
  const observerOptions = { 
    threshold: 0.05,
    rootMargin: '0px 0px 50px 0px' 
  };

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
    const container = (root && root.querySelectorAll) ? root : document;
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
    const container = (root && root.querySelectorAll) ? root : document;
    container.querySelectorAll(animationSelectors.join(',')).forEach(el => {
      if (el.classList.contains('visible')) return;
      const r = el.getBoundingClientRect();
      // 🔧 OPTIMISATION 2 : Déclenchement dès que le haut est visible (r.top < innerHeight)
      const inView = r.top < (window.innerHeight || document.documentElement.clientHeight) && r.bottom > 0;
      if (inView) {
        // Suppression du délai de 150ms pour plus de réactivité
        el.classList.add('visible');
      }
    });
  }

  // Initialisation au chargement
  const handleInitialLoad = () => {
    observeNewElements();
    revealIfInViewport();

    // Patch spécifique Hero (Logo & Titre)
    const heroEls = [document.getElementById("hero-logo"), document.getElementById("hero-title")];
    heroEls.forEach(el => {
      if (el) {
        el.classList.add("visible");
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleInitialLoad);
  } else {
    handleInitialLoad();
  }

  // MutationObserver pour les éléments chargés dynamiquement
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
  }
}