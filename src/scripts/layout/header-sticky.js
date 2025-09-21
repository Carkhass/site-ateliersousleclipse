/**
 * Ajoute ou retire la classe .scrolled sur le header en fonction du scroll.
 * Force l'état initial au chargement.
 */
// src/scripts/layout/header-sticky.js
export function initHeaderSticky() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const header = document.getElementById('site-header');
  if (!header) return;

  function update() {
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }

  document.addEventListener('scroll', update);
  window.addEventListener('load', update);
}
