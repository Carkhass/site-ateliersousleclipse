(() => {
  // Empêche l'exécution côté serveur
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  /**
   * Fonction qui rend visible un élément .reveal-on-scroll avec animation séquencée
   */
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

  window.addEventListener('load', () => {
    // Retirer le blocage initial
    document.querySelectorAll('.hidden-init').forEach(el => el.classList.remove('hidden-init'));
    document.documentElement.classList.remove('no-js');

    const revealEls = document.querySelectorAll('.reveal-on-scroll');
    const fadeSlideEls = document.querySelectorAll('.fade-slide-up');

    // Attribution automatique de variantes
    revealEls.forEach((el, idx) => {
      if (idx % 3 === 1) el.classList.add('var-slide-left');
      if (idx % 3 === 2) el.classList.add('var-zoom-in');
    });

    // IntersectionObserver commun
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

    // Observation initiale
    revealEls.forEach((el) => observer.observe(el));
    fadeSlideEls.forEach((el) => observer.observe(el));

    console.log('Observing', revealEls.length, 'reveal-on-scroll elements and', fadeSlideEls.length, 'fade-slide-up elements');

    // MutationObserver pour attraper les éléments ajoutés après coup
    const mo = new MutationObserver(() => {
      document.querySelectorAll('.fade-slide-up, .reveal-on-scroll').forEach(el => {
        observer.observe(el);
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Check différé pour éléments déjà visibles au chargement
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
    setTimeout(delayedCheck, 800);

    // ✅ Filet de sécurité : carte 3D + texte premium
    setTimeout(() => {
      const card = document.querySelector('.card-3d-wrapper');
      if (card && !card.classList.contains('visible')) {
        card.classList.add('visible');
      }
      const premiumText = document.querySelector('.premium-section .premium-text');
      if (premiumText && !premiumText.classList.contains('visible')) {
        premiumText.classList.add('visible');
      }
    }, 1000);

    // -----------------------------------------
    // Hint flip sur mobile pour la carte 3D
    // -----------------------------------------
    if (window.innerWidth <= 768) {
      const cardWrapper = document.querySelector('.card-3d-wrapper');
      let cardClicked = false;

      if (cardWrapper) {
        cardWrapper.addEventListener('click', () => {
          cardClicked = true;
          cardWrapper.querySelector('.card-3d')?.classList.add('clicked');
        });

        const flipObserver = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              cardWrapper.classList.add('hint-flip');

              const intervalId = setInterval(() => {
                if (!cardClicked) {
                  cardWrapper.classList.remove('hint-flip');
                  void cardWrapper.offsetWidth;
                  cardWrapper.classList.add('hint-flip');
                }
              }, 3000);

              const stopObserver = new IntersectionObserver((ents) => {
                ents.forEach(ent => {
                  if (!ent.isIntersecting) {
                    clearInterval(intervalId);
                    stopObserver.disconnect();
                  }
                });
              }, { threshold: 0 });
              stopObserver.observe(cardWrapper);

              obs.unobserve(cardWrapper);
            }
          });
        }, { threshold: 0.5 });
        flipObserver.observe(cardWrapper);
      }
    }
  });
})();
