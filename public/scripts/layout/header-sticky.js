//<!-- script header sticky -->
document.addEventListener('scroll', () => {
  const header = document.getElementById('site-header');
  if (!header) return;

  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Forcer l'état initial au chargement
window.addEventListener('load', () => {
  const header = document.getElementById('site-header');
  if (window.scrollY <= 10) {
    header.classList.remove('scrolled');
  }
});
