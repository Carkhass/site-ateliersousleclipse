document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById('hero-title');
  const subtitle = document.getElementById('hero-subtitle');
  if (!title || !subtitle) return;

  // --- TITRE ---
  title.style.opacity = '0';
  title.style.transition = 'opacity 0.6s ease';

  setTimeout(() => {
    title.style.opacity = '1';
    title.classList.add('active'); // halo
  }, 100);

  // --- SOUS-TITRE ---
  const animateSubtitle = (el) => {
    const rawHTML = el.innerHTML;
    const chars = rawHTML
      .split(/(<[^>]+>)/g)
      .map(part =>
        part.startsWith('<') && part.endsWith('>')
          ? part
          : part.split('').map(c =>
              c === ' '
                ? '<span class="letter">&nbsp;</span>'
                : `<span class="letter">${c}</span>`
            ).join('')
      ).join('');

    el.innerHTML = chars;

    let delay = 0;
    el.querySelectorAll('.letter').forEach(span => {
      span.style.animationDelay = `${delay}s`;
      delay += 0.03; // vitesse de décalage entre lettres
    });

    el.style.opacity = 1; // rendre visible maintenant
  };

  const fadeInDuration = 600; // ms
  const extraDelay = 100; // ms
  setTimeout(() => {
    animateSubtitle(subtitle);
  }, fadeInDuration + extraDelay);
});
