(() => {
  // Liste des classes d'animation à observer
  const animationClasses = [
    '.reveal-on-scroll',
    '.fade-slide-up',
    '.fade-in',
    '.slide-up',
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
    root.querySelectorAll(animationClasses.join(',')).forEach(el => {
      if (!observedElements.has(el)) {
        observedElements.add(el);
        revealObserver.observe(el);
      }
    });
  }

  // ✅ Fonction pour révéler immédiatement les éléments déjà visibles,
  // mais avec un petit délai pour laisser le CSS initial s'appliquer
  function revealIfInViewport(root = document) {
    root.querySelectorAll(animationClasses.join(',')).forEach(el => {
      if (el.classList.contains('visible')) return;
      const r = el.getBoundingClientRect();
      const inView = r.top < (window.innerHeight || document.documentElement.clientHeight) && r.bottom > 0;
      if (inView) {
        // Délai pour éviter que l'état initial et final soient appliqués dans le même frame
        setTimeout(() => {
          el.classList.add('visible');
        }, 100); // 100ms suffit pour déclencher la transition
      }
    });
  }

  // Premier scan au chargement
  document.addEventListener('DOMContentLoaded', () => {
    observeNewElements();
    revealIfInViewport();
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

  // On expose la fonction pour init-client.js
  window.observeNewElements = observeNewElements;
})();
