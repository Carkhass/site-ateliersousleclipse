(() => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const makeVisible = (el) => {
    const blockIndex = [...document.querySelectorAll('.reveal-on-scroll')].indexOf(el);
    const initialDelay = (blockIndex % 3) * 100;
    const children = el.querySelectorAll(':scope > *');

    if (children.length) {
      children.forEach((child, i) => {
        setTimeout(() => child.classList.add('visible'), initialDelay + i * 150);
      });
    } else {
      setTimeout(() => el.classList.add('visible'), initialDelay);
    }
  };

  window.addEventListener('load', () => {
    document.querySelectorAll('.hidden-init').forEach(el => el.classList.remove('hidden-init'));
    document.documentElement.classList.remove('no-js');

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('reveal-on-scroll')) makeVisible(entry.target);
          if (entry.target.classList.contains('fade-slide-up')) entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0, root: null, rootMargin: '0px 0px -10% 0px' });

    const observeAll = () => {
      document.querySelectorAll('.fade-slide-up, .reveal-on-scroll').forEach(el => observer.observe(el));
    };

    // Observation initiale
    observeAll();
    console.log('Observing', document.querySelectorAll('.reveal-on-scroll').length, 'reveal-on-scroll elements and', document.querySelectorAll('.fade-slide-up').length, 'fade-slide-up elements');

    // Observer les ajouts dynamiques
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    // Filet de sécurité : tout rendre visible après 1,5s si pas déclenché
    setTimeout(() => {
      document.querySelectorAll('.fade-slide-up, .reveal-on-scroll').forEach(el => {
        if (!el.classList.contains('visible')) el.classList.add('visible');
      });
    }, 1500);

    // Sécurité spécifique carte 3D + premium
    setTimeout(() => {
      document.querySelector('.card-3d-wrapper')?.classList.add('visible');
      document.querySelector('.premium-section .premium-text')?.classList.add('visible');
    }, 1000);

    // Hint flip mobile
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
