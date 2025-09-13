(() => {
  // Sélecteurs d'animations à observer
  // On attrape toutes les variantes fade-slide-* automatiquement
  const animationSelectors = [
    '[class*="fade-slide-"]', // left, right, up, down...
    '.fade-in',
    '.slide-up',
    '.reveal-on-scroll',
    '.animate-on-scroll'
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

  const revealObserver = new IntersectionObserver(onIntersect, observerOptions);

  function observeNewElements(root = document) {
    root.querySelectorAll(animationSelectors.join(',')).forEach(el => {
      if (!observedElements.has(el)) {
        observedElements.add(el);
        revealObserver.observe(el);
      }
    });
  }

  // Révèle immédiatement ce qui est déjà dans le viewport
  function revealIfInViewport(root = document) {
    root.querySelectorAll(animationSelectors.join(',')).forEach(el => {
      if (el.classList.contains('visible')) return;
      const r = el.getBoundingClientRect();
      const inView = r.top < (window.innerHeight || document.documentElement.clientHeight) && r.bottom > 0;
      if (inView) {
        setTimeout(() => {
          el.classList.add('visible');
        }, 100);
      }
    });
  }

  // Premier scan au chargement
  document.addEventListener('DOMContentLoaded', () => {
    observeNewElements();
    revealIfInViewport();

    // --- PATCH : forcer la carte 3D visible sur desktop si déjà dans le viewport ---
    if (window.innerWidth >= 1024) {
      const cardWrapper = document.querySelector('.premium-section .card-3d-wrapper.fade-slide-up');
      if (cardWrapper) {
        const r = cardWrapper.getBoundingClientRect();
        const inView = r.top < window.innerHeight && r.bottom > 0;
        if (inView) {
          setTimeout(() => {
            cardWrapper.classList.add('visible');
          }, 150);
        }
      }
    }
    // -------------------------------------------------------------------------------
  });

  // Surveille le DOM pour détecter de nouveaux éléments
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

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Expose la fonction si besoin ailleurs
  window.observeNewElements = observeNewElements;
})();
