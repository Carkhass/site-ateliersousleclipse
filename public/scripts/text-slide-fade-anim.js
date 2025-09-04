// public/scripts/text-slide-fade-anim.js
// Rôle: gérer exclusivement les animations d'apparition (fade/slide + cascade).
// - Ajoute .visible aux éléments .fade-slide-up, .fade-slide-left, .fade-in-up, .fade-in-delay.
// - Ne déclenche JAMAIS de logique de carrousel (Embla/Swiper).
// - Compatible avec reveal-on-scroll.js qui gère d'autres classes (.fade-in, .slide-up, etc.)

document.addEventListener("DOMContentLoaded", () => {
  const SELECTORS = ['.fade-slide-up', '.fade-slide-left', '.fade-in-up', '.fade-in-delay'];
  const elements = document.querySelectorAll(SELECTORS.join(','));

  const reveal = el => el.classList.add('visible');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        reveal(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  // Observer classique
  elements.forEach(el => observer.observe(el));

  // Révélation immédiate pour les éléments déjà dans le viewport au chargement
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
