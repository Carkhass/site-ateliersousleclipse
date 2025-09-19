// Rôle: gérer exclusivement les animations d'apparition (fade/slide + cascade).
// - Ajoute .visible aux éléments .fade-slide-up, .fade-slide-left, .fade-in-up, .fade-in-delay.
// - Ne déclenche JAMAIS de logique de carrousel (Embla/Swiper).
// - Compatible avec reveal-on-scroll.js qui gère d'autres classes (.fade-in, .slide-up, etc.)
// src/scripts/animations/text-slide-fade-anim.js
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", () => {
    const SELECTORS = ['.fade-slide-up', '.fade-slide-left', '.fade-in-up', '.fade-in-delay'];
    const elements = document.querySelectorAll(SELECTORS.join(','));

    const reveal = (el) => el.classList.add('visible');

    if (typeof IntersectionObserver === 'undefined') {
      elements.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    elements.forEach(el => observer.observe(el));

    const revealIfInViewport = () => {
      elements.forEach(el => {
        if (el.classList.contains('visible')) return;
        const r = el.getBoundingClientRect();
        const inView = r.top < (window.innerHeight || document.documentElement.clientHeight) && r.bottom > 0;
        if (inView) {
          setTimeout(() => reveal(el), 100);
        }
      });
    };
    revealIfInViewport();
  });
}
