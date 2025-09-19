/**
 * Ajoute ou retire la classe .scrolled sur le header en fonction du scroll.
 * Force l'état initial au chargement.
 */
// src/scripts/layout/header-sticky.js
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('scroll', () => {
    const header = document.getElementById('site-header');
    if (!header) return;
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  window.addEventListener('load', () => {
    const header = document.getElementById('site-header');
    if (!header) return;
    if (window.scrollY <= 10) header.classList.remove('scrolled');
  });
}
