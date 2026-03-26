import { initRevealOnScroll } from '../animations/reveal-on-scroll.js';

export function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.knife-card');
  
  if (!buttons.length || !cards.length) return;

  function applyFilter(filter) {
    cards.forEach(card => {
      // On retire la classe visible pour que RevealOnScroll puisse la remettre
      card.classList.remove('visible');
      
      const type = (card.getAttribute('data-type') || '').toLowerCase().trim();
      const isDispo = card.getAttribute('data-dispo') === 'true';

      let show = false;
      if (filter === 'all') {
        show = (type !== 'video');
      } else if (filter === 'video') {
        show = (type === 'video');
      } else if (filter === 'dispo') {
        show = (isDispo && type !== 'video');
      } else if (filter === 'modele') {
        show = (type === 'modele');
      }

      if (show) {
        card.classList.remove('hidden');
        card.style.display = 'flex'; // Force l'affichage pour éviter les conflits CSS
      } else {
        card.classList.add('hidden');
        card.style.display = 'none';
      }
    });
    
    // On relance les animations après un court délai
    setTimeout(() => {
      initRevealOnScroll();
    }, 100);
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  // Application initiale pour nettoyer la grille au chargement
  const activeBtn = document.querySelector('.filter-btn.active');
  if (activeBtn) {
    applyFilter(activeBtn.getAttribute('data-filter'));
  }
}