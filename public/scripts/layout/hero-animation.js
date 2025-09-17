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
      .split(/(<[^>]+>)/g) // garde les balises intactes (<em>, etc.)
      .map(part => {
        if (/^<[^>]+>$/.test(part.trim())) {
          return part;
        }
        return part.split('').map(c =>
          c === ' '
            ? '<span class="letter">&nbsp;</span>'
            : `<span class="letter">${c}</span>`
        ).join('');
      })
      .join('');

    el.innerHTML = chars;

    // Animation décalée
    let delay = 0;
    el.querySelectorAll('.letter').forEach(span => {
      span.style.animationDelay = `${delay}s`;
      delay += 0.03;
    });

    // ➜ Insertion du saut de ligne après un mot précis en mobile
    if (window.innerWidth <= 1024) {
      const letters = el.querySelectorAll('.letter');
      // Trouve l'index où couper (ex: après "acier")
      // Ici, on coupe après le 38e caractère (à ajuster selon ton texte)
      const cutIndex = 35;
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

  const fadeInDuration = 600; // ms
  const extraDelay = 100; // ms
  setTimeout(() => {
    animateSubtitle(subtitle);
  }, fadeInDuration + extraDelay);
});
