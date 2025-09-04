// text-slide-fade-anim.js
import { initEmbla } from './init-embla.js';

// Fonction générique pour observer et déclencher les animations
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Ajoute la classe visible pour déclencher l'animation CSS
        entry.target.classList.add('visible');

        // Si c'est le wrapper du carousel → on initialise Embla maintenant
        if (entry.target.classList.contains('fade-in-delay')) {
          initEmbla();
        }

        // On arrête d'observer cet élément
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  // On observe tous les éléments animables
  document.querySelectorAll(
    '.fade-slide-up, .fade-slide-left, .fade-in-delay'
  ).forEach(el => observer.observe(el));
});
