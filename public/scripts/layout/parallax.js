// parallax.js — Gère l'effet de parallaxe sur les sections .parallax-section
(() => {
  const visible = new Set();
  let ticking = false;
  const sections = Array.from(document.querySelectorAll('.parallax-section'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) visible.add(e.target);
      else visible.delete(e.target);
    });
    requestTick();
  }, { root: null, rootMargin: '20% 0px', threshold: 0 });

  sections.forEach(sec => io.observe(sec));

  function requestTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  function update() {
    ticking = false;
    const vh = window.innerHeight;

    visible.forEach(section => {
      const target = section.querySelector('[data-parallax-target]');
      if (!target) return;

      const rect = section.getBoundingClientRect();
      const progress = ((rect.top + rect.height / 2) - vh / 2) / (vh / 2);
      const speed = parseFloat(section.getAttribute('data-parallax-speed')) || 45;

      let offset = 0;
      const rawOffset = section.getAttribute('data-parallax-offset');
      if (rawOffset) {
        if (rawOffset.trim().endsWith('%')) {
          offset = (parseFloat(rawOffset) / 100) * rect.height;
        } else {
          offset = parseFloat(rawOffset) || 0;
        }
      }

      const translate = -progress * (speed / 2) + offset;

      const baseZoom = parseFloat(section.getAttribute('data-parallax-zoom')) || 1;
      const zoomStrength = parseFloat(section.getAttribute('data-parallax-zoom-strength')) || 0;
      const zoom = baseZoom; // pas de variation


      target.style.transform = `translateY(${translate}px) scale(${zoom})`;
    });
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
  document.addEventListener('DOMContentLoaded', requestTick);

  const mo = new MutationObserver(() => {
    document.querySelectorAll('.parallax-section').forEach(sec => io.observe(sec));
    requestTick();
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();
