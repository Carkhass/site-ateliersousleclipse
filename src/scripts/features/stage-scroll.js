// src/scripts/features/stage-scroll.js

export function initStageAndContactScroll() {
  document.body.addEventListener('click', (e) => {
    const target = e.target;

    // 1. GESTION DU BOUTON "RÉSERVER"
    const stageBtn = target.closest('[data-stage-btn]');
    if (stageBtn) {
      e.preventDefault();
      const stageName = stageBtn.getAttribute('data-stage-btn');
      const messageField = document.getElementById('message');
      const contactSection = document.getElementById('contact');

      if (messageField && stageName) {
        messageField.value = `Bonjour Yann, je souhaite réserver une place pour le stage : ${stageName}. Merci de me recontacter pour les prochaines disponibilités.`;
        messageField.focus();
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
      return; 
    }

    // 2. GESTION DES LIENS #CONTACT (Menu)
    const contactLink = target.closest('a[href$="#contact"]');
    if (contactLink) {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        e.preventDefault();
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Fermeture menu mobile si présent
        document.body.classList.remove('menu-open');
        const mobileMenu = document.querySelector('.menu-mobile');
        if (mobileMenu) {
            mobileMenu.style.transform = 'translateX(120%)';
        }
      }
    }
  });
}