document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById('hero-title');
  const subtitle = document.getElementById('hero-subtitle');
  if (!title || !subtitle) return;

  const showTitle = () => {
    title.classList.add('visible'); // fade-in-up
    title.classList.add('active');  // halo
  };

  // Si déjà visible au chargement → déclenche après un petit délai
  const rect = title.getBoundingClientRect();
  const inView = rect.top < window.innerHeight && rect.bottom > 0;
  if (inView) {
    requestAnimationFrame(() => {
      requestAnimationFrame(showTitle);
    });
  } else {
    // Sinon, on attend qu'il entre dans le viewport
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          showTitle();
          observer.unobserve(title);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(title);
  }

  // Animation lettre par lettre du sous-titre
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
      delay += 0.03;
    });
    el.style.opacity = 1;
  };

  // Déclenche le sous-titre immédiatement si visible
  const subRect = subtitle.getBoundingClientRect();
  const subInView = subRect.top < window.innerHeight && subRect.bottom > 0;
  if (subInView) {
    animateSubtitle(subtitle);
  } else {
    const subObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateSubtitle(subtitle);
          subObserver.unobserve(subtitle);
        }
      });
    }, { threshold: 0.1 });
    subObserver.observe(subtitle);
  }
});
