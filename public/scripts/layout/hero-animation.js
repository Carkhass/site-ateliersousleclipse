document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById('hero-title');
  const subtitle = document.getElementById('hero-subtitle');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {

        // Titre : fade-in-up + halo
        if (entry.target === title) {
          title.classList.add('visible'); // déclenche fade-in-up
          title.classList.add('active');  // déclenche halo
        }

        // Sous-titre : animation lettre par lettre
        if (entry.target === subtitle) {
          animateSubtitle(subtitle);
        }

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(title);
  observer.observe(subtitle);

  function animateSubtitle(el) {
    const rawHTML = el.innerHTML;
    const chars = rawHTML
      .split(/(<[^>]+>)/g)
      .map(part =>
        part.startsWith('<') && part.endsWith('>')
          ? part
          : part
              .split('')
              .map(c =>
                c === ' '
                  ? '<span class="letter">&nbsp;</span>'
                  : `<span class="letter">${c}</span>`
              )
              .join('')
      )
      .join('');

    el.innerHTML = chars;

    let delay = 0;
    el.querySelectorAll('.letter').forEach(span => {
      span.style.animationDelay = `${delay}s`;
      delay += 0.03;
    });

    el.style.opacity = 1;
  }
});
