// src/scripts/header-hero.js
export function initHeaderHero() {
  const heroTitle = document.getElementById('hero-title');
  const headerTitle = document.getElementById('header-title');

  function handleScroll() {
    if (!heroTitle || !headerTitle) return;

    const heroBottom = heroTitle.getBoundingClientRect().bottom;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // Même logique desktop & mobile : crossfade
    if (heroBottom <= 120) {
      // Hero disparaît
      heroTitle.classList.add('fade-out');

      // Header apparaît
      headerTitle.classList.remove('hidden');
      headerTitle.classList.add('fade-in');
    } else {
      // Hero revient
      heroTitle.classList.remove('fade-out');

      // Header disparaît
      headerTitle.classList.add('hidden');
      headerTitle.classList.remove('fade-in');
    }
  }

  window.addEventListener('scroll', handleScroll);
}
