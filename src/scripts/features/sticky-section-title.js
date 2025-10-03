export function initStickySectionTitle() {
  const titleEl = document.getElementById('knife-title');
  const topEl = titleEl.querySelector('.knife-title-top');
  const bottomEl = titleEl.querySelector('.knife-title-bottom');
  const subtitleEl = document.getElementById('knife-subtitle-text');
  const triggers = document.querySelectorAll('.knife-trigger');
  const links = document.querySelectorAll('.knife-nav a');
  const stickyHeader = document.getElementById('knife-sticky-header');
  const sentinel = document.getElementById('knife-sticky-sentinel'); // 👈 ajouté dans ton HTML

  let currentId = null;
  let firstLoad = true;

  // Découpe le texte en mots avec index (--i)
  function setSplitText(el, text) {
    const words = text.split(' ');
    el.innerHTML = words
      .map((w, i) => `<span class="word" style="--i:${i}">${w}</span>`)
      .join(' ');
  }

  function updateTitle(trigger) {
    if (!trigger) return;

    const newTitle = trigger.dataset.title || '';
    const newSubtitle = trigger.dataset.subtitle || '';
    const parentSection = trigger.closest('.knife-section');
    const newId = parentSection?.id;

    if (!newId || newId === currentId) return;
    currentId = newId;

    // fade-out du sous-titre
    subtitleEl.classList.add('knife-subtitle-hidden');

    if (firstLoad) {
      // 👉 Premier affichage : pas de découpe, juste fade-in
      setSplitText(topEl, newTitle);
      setSplitText(bottomEl, newTitle);

      titleEl.classList.add('animate-in');
      setTimeout(() => titleEl.classList.remove('animate-in'), 800);

      subtitleEl.textContent = newSubtitle;
      subtitleEl.classList.remove('knife-subtitle-hidden');

      firstLoad = false;
    } else {
      // 👉 Updates : découpe diagonale + séquencement par mot
      topEl.classList.add('animate-out');
      bottomEl.classList.add('animate-out');

      setTimeout(() => {
        topEl.classList.remove('animate-out');
        bottomEl.classList.remove('animate-out');

        setSplitText(topEl, newTitle);
        setSplitText(bottomEl, newTitle);

        titleEl.classList.add('animate-in');
        setTimeout(() => titleEl.classList.remove('animate-in'), 800);

        subtitleEl.textContent = newSubtitle;
        subtitleEl.classList.remove('knife-subtitle-hidden');
      }, 600); // durée des anims cutTop/cutBottom
    }

    // menu actif
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${newId}`);
    });
  }

  // Observer pour les triggers (mise à jour du titre)
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) updateTitle(entry.target);
      });
    },
    { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 }
  );
  triggers.forEach(trigger => observer.observe(trigger));

  // Observer pour activer les lignes d’accent du sticky
  if (sentinel && stickyHeader) {
    const stickyObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            // sentinel sort du viewport → sticky actif
            stickyHeader.classList.add('active');
          } else {
            // sentinel visible → sticky pas encore collé
            stickyHeader.classList.remove('active');
          }
        });
      },
      { rootMargin: `-${64}px 0px 0px 0px`, threshold: 0 }
    );
    stickyObserver.observe(sentinel);
  }

  // Scroll top → retour à cuisine
  window.addEventListener('scroll', () => {
    if (window.scrollY === 0 && triggers.length > 0) {
      updateTitle(triggers[0]);
    }
  });

  // Init au chargement
  window.addEventListener('load', () => {
    if (triggers.length > 0) updateTitle(triggers[0]);
  });
}
