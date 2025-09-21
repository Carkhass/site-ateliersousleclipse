// src/scripts/layout/hero-animation.js
// Anime le titre et le sous-titre du hero au chargement de la page
// - Fade-in du titre avec halo
// - Animation lettre par lettre du sous-titre
// - Insertion d'un saut de ligne sur mobile après un index précis

export function initHeroAnimation() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const title = document.getElementById('hero-title');
  const subtitle = document.getElementById('hero-subtitle');
  if (!title || !subtitle) return;

  // Titre
  title.style.opacity = '0';
  title.style.transition = 'opacity 0.6s ease';
  setTimeout(() => {
    title.style.opacity = '1';
    title.classList.add('active');
  }, 100);

  // Sous-titre
  const animateSubtitle = (el) => {
    const rawHTML = el.innerHTML;
    const chars = rawHTML
      .split(/(<[^>]+>)/g)
      .map(part => {
        if (/^<[^>]+>$/.test(part.trim())) return part;
        return part.split('').map(c =>
          c === ' '
            ? '<span class="letter">&nbsp;</span>'
            : `<span class="letter">${c}</span>`
        ).join('');
      })
      .join('');
    el.innerHTML = chars;

    let delay = 0;
    el.querySelectorAll('.letter').forEach(span => {
      span.style.animationDelay = `${delay}s`;
      delay += 0.03;
    });

    if (window.innerWidth <= 1024) {
      const letters = el.querySelectorAll('.letter');
      const cutIndex = 37;
      if (letters[cutIndex]) {
        const br = document.createElement('br');
        br.style.display = 'block';
        br.style.width = '100%';
        br.style.lineHeight = '0';
        letters[cutIndex].after(br);
      }
    }

    el.style.opacity = 1;
  };

  const fadeInDuration = 600;
  const extraDelay = 100;
  setTimeout(() => {
    animateSubtitle(subtitle);
  }, fadeInDuration + extraDelay);
}
