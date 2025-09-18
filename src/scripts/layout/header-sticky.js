/**
 // public/scripts/layout/header-sticky.js
 * Ajoute ou retire la classe .scrolled sur le header en fonction du scroll.
 * Force l'état initial au chargement.
 */


function updateHeaderState() {
  const header = document.getElementById('site-header');
  if (!header) return;

  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

// Met à jour l'état au scroll
document.addEventListener('scroll', updateHeaderState);

// Force l'état initial au chargement
window.addEventListener('load', updateHeaderState);
