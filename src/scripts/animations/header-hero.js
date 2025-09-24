export function initHeaderHero() {
  const heroTitle = document.getElementById('hero-title');
  const headerTitle = document.getElementById('header-title');

  function handleScroll() {
    if (!heroTitle || !headerTitle) return;

    const heroBottom = heroTitle.getBoundingClientRect().bottom;

    // Crossfade desktop & mobile
    if (heroBottom <= 120) {
      // Hero disparaît
      heroTitle.classList.add('fade-out');
      heroTitle.style.visibility = "hidden"; // 👈 disparaît vraiment du flux

      // Header apparaît avec scale
      headerTitle.classList.remove('hidden');
      headerTitle.classList.add('fade-in');
    } else {
      // Hero revient
      heroTitle.classList.remove('fade-out');
      heroTitle.style.visibility = "visible";

      // Header disparaît
      headerTitle.classList.add('hidden');
      headerTitle.classList.remove('fade-in');
    }
  }

  window.addEventListener('scroll', handleScroll);
}
