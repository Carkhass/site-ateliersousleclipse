// Ajoute/enlève la classe .scrolled sur le header au scroll
window.addEventListener('scroll', () => {
  document.querySelector('header')
    ?.classList.toggle('scrolled', window.scrollY > 50);
});
