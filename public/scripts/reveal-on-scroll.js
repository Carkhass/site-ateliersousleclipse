(() => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Fonction centrale qui déclenche l’animation sur reveal-on-scroll
  const makeVisible = (el) => {
    const blockIndex = [...document.querySelectorAll('.reveal-on-scroll')].indexOf(el);
    const initialDelay = (blockIndex % 3) * 100; // 0 / 100 / 200 ms

    const children = el.querySelectorAll(':scope > *');
    if (children.length) {
      children.forEach((child, i) => {
        setTimeout(() => {
          child.classList.add('visible');
        }, initialDelay + i * 150);
      });
    } else {
      setTimeout(() => {
        el.classList.add('visible');
      }, initialDelay);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Retirer le blocage initial
    document.querySelectorAll('.hidden-init').forEach(el => el.classList.remove('hidden-init'));
    document.documentElement.classList.remove('no-js');

    const revealEls = document.querySelectorAll('.reveal-on-scroll');
    const fadeSlideEls = document.querySelectorAll('.fade-slide-up');

    // Assigner automatiquement une variante aux reveal
    revealEls.forEach((el, idx) => {
      if (idx % 3 === 1) el.classList.add('var-slide-left');
      if (idx % 3 === 2) el.classList.add('var-zoom-in');
    });

    // Observer commun pour reveal-on-scroll ET fade-slide-up
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('reveal-on-scroll')) {
            makeVisible(entry.target);
          }
          if (entry.target.classList.contains('fade-slide-up')) {
            entry.target.classList.add('visible');
          }
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0,
      root: null,
      rootMargin: '0px 0px -10% 0px'
    });

    // Lancer l'observation
    revealEls.forEach((el) => observer.observe(el));
    fadeSlideEls.forEach((el) => observer.observe(el));

    // Check différé pour ceux déjà visibles au chargement
    const delayedCheck = () => {
      [...revealEls, ...fadeSlideEls].forEach((el) => {
        if (el.classList.contains('visible')) return;
        const r = el.getBoundingClientRect();
        const inView = r.bottom > 0 && r.top < window.innerHeight;
        if (inView) {
          if (el.classList.contains('reveal-on-scroll')) {
            makeVisible(el);
          }
          if (el.classList.contains('fade-slide-up')) {
            el.classList.add('visible');
          }
          observer.unobserve(el);
        }
      });
    };

    setTimeout(delayedCheck, 300);
    window.addEventListener('load', () => {
      setTimeout(delayedCheck, 200);
    });

    // -----------------------------------------
    // Hint flip sur mobile pour la carte 3D
    // -----------------------------------------
    if (window.innerWidth <= 768) {
      const card = document.querySelector('.card-3d-wrapper');
      if (card) {
        const flipObserver = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              card.classList.add('hint-flip');
              obs.unobserve(card); // une seule fois
            }
          });
        }, { threshold: 0.5 });
        flipObserver.observe(card);
      }
    }
  });
})();
