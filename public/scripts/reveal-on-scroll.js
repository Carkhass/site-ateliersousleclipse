(() => {
  // Sécurité : on s'assure que le script ne s'exécute que côté navigateur
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  /**
   * Fonction centrale qui déclenche l’animation sur un élément .reveal-on-scroll
   * @param {HTMLElement} el - L'élément à révéler
   */
  const makeVisible = (el) => {
    // Index du bloc dans la liste des .reveal-on-scroll
    const blockIndex = [...document.querySelectorAll('.reveal-on-scroll')].indexOf(el);

    // Décalage initial en ms selon la position dans la séquence (0 / 100 / 200 ms)
    const initialDelay = (blockIndex % 3) * 100;

    // On cible uniquement les enfants directs de l'élément
    const children = el.querySelectorAll(':scope > *');

    if (children.length) {
      // Si l'élément a des enfants, on les révèle un par un avec un délai progressif
      children.forEach((child, i) => {
        setTimeout(() => {
          child.classList.add('visible');
        }, initialDelay + i * 150); // 150 ms entre chaque enfant
      });
    } else {
      // Sinon, on révèle directement l'élément
      setTimeout(() => {
        el.classList.add('visible');
      }, initialDelay);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Retirer la classe qui bloque l'affichage initial
    document.querySelectorAll('.hidden-init').forEach(el => el.classList.remove('hidden-init'));

    // Retirer la classe no-js sur <html> (utile pour certaines animations CSS)
    document.documentElement.classList.remove('no-js');

    // Sélection des éléments à observer
    const revealEls = document.querySelectorAll('.reveal-on-scroll'); // blocs avec animation séquencée
    const fadeSlideEls = document.querySelectorAll('.fade-slide-up'); // blocs avec fade + slide simple

    // Attribution automatique d'une variante d'animation aux .reveal-on-scroll
    revealEls.forEach((el, idx) => {
      if (idx % 3 === 1) el.classList.add('var-slide-left');
      if (idx % 3 === 2) el.classList.add('var-zoom-in');
    });

    // IntersectionObserver commun pour déclencher les animations
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('reveal-on-scroll')) {
            makeVisible(entry.target);
          }
          if (entry.target.classList.contains('fade-slide-up')) {
            entry.target.classList.add('visible');
          }
          // On arrête d'observer l'élément une fois révélé
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0, // déclenche dès que l'élément entre dans le viewport
      root: null,
      rootMargin: '0px 0px -10% 0px' // déclenche un peu avant la fin du viewport
    });

    // Lancer l'observation
    revealEls.forEach((el) => observer.observe(el));
    fadeSlideEls.forEach((el) => observer.observe(el));

    // Vérification différée pour les éléments déjà visibles au chargement
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

    // On lance cette vérif après un petit délai et aussi après le load complet
    setTimeout(delayedCheck, 300);
    window.addEventListener('load', () => {
      setTimeout(delayedCheck, 200);
    });

    // -----------------------------------------
    // Hint flip sur mobile pour la carte 3D
    // -----------------------------------------
    if (window.innerWidth <= 768) {
      const cardWrapper = document.querySelector('.card-3d-wrapper');
      let cardClicked = false; // Flag pour savoir si l'utilisateur a cliqué

      if (cardWrapper) {
        // Quand on clique sur la carte, on arrête l'animation d'invitation
        cardWrapper.addEventListener('click', () => {
          cardClicked = true;
          cardWrapper.querySelector('.card-3d')?.classList.add('clicked');
        });

        const flipObserver = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Première animation immédiate
              cardWrapper.classList.add('hint-flip');

              // Boucle toutes les 3 secondes tant que la carte n'a pas été cliquée
              const intervalId = setInterval(() => {
                if (!cardClicked) {
                  cardWrapper.classList.remove('hint-flip');
                  void cardWrapper.offsetWidth; // force un reflow
                  cardWrapper.classList.add('hint-flip');
                }
              }, 3000);

              // Stoppe la boucle si la carte sort du viewport
              const stopObserver = new IntersectionObserver((ents) => {
                ents.forEach(ent => {
                  if (!ent.isIntersecting) {
                    clearInterval(intervalId);
                    stopObserver.disconnect();
                  }
                });
              }, { threshold: 0 });
              stopObserver.observe(cardWrapper);

              // On arrête d'observer après la première entrée
              obs.unobserve(cardWrapper);
            }
          });
        }, { threshold: 0.5 }); // déclenche quand 50% de la carte est visible
        flipObserver.observe(cardWrapper);
      }
    }
  });
})();
