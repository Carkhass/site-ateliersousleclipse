// src/scripts/features/booking-modal.js

export function initBookingLogic() {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;

  const closeModal = () => {
    document.body.classList.remove('active-modal');
    modal.classList.remove('visible-fade');
  };

  const openModal = (data) => {
    const { ref, isDispo, acier, manche, prix, date, image } = data;

    const titleField = document.getElementById('modal-title');
    const refDisplay = document.getElementById('modal-ref');
    const messageField = document.getElementById('modal-msg');

    if (titleField) {
      titleField.textContent = isDispo ? "Réserver ce couteau" : "Demander une création";
    }
    if (refDisplay) {
      refDisplay.textContent = `Modèle : ${ref} ${date ? '(' + date + ')' : ''}`;
    }

    // Mise à jour de l'aperçu visible
    const descAcier = document.getElementById('modal-desc-acier');
    const descManche = document.getElementById('modal-desc-manche');
    const descPrix = document.getElementById('modal-desc-prix');
    if (descAcier) descAcier.textContent = acier;
    if (descManche) descManche.textContent = manche;
    if (descPrix) descPrix.textContent = prix;

    // Remplissage des inputs cachés pour PHP
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    };

    setVal('modal-input-ref', ref);
    setVal('modal-input-acier', acier);
    setVal('modal-input-manche', manche);
    setVal('modal-input-prix', prix);
    setVal('modal-input-date', date);
    setVal('modal-input-image', image);

    // Initialisation du chronomètre anti-bot
    const timerInput = modal.querySelector('input[name="_form_timer"]');
    if (timerInput) timerInput.value = Date.now().toString();

    // Message pré-rempli plus précis
    if (messageField) {
      const detailPiece = (acier !== 'Non précisé' || manche !== 'Non précisé') 
        ? ` (${acier}, ${manche})` 
        : '';

      messageField.value = isDispo 
        ? `Bonjour Yann,\n\nJe souhaiterais réserver le couteau "${ref}"${detailPiece}. Est-il encore disponible ?`
        : `Bonjour Yann,\n\nJe suis intéressé par le modèle "${ref}"${detailPiece} pour une commande personnalisée.`;
    }

    document.body.classList.add('active-modal');
    modal.classList.add('visible-fade');
  };

  document.addEventListener('click', (e) => {
    const target = e.target;

    const trigger = target.closest('.trigger-booking-global');
    if (trigger) {
      const data = {
        ref: trigger.getAttribute('data-ref') || '',
        isDispo: trigger.getAttribute('data-dispo') === 'true',
        acier: trigger.getAttribute('data-acier') || 'Non précisé',
        manche: trigger.getAttribute('data-manche') || 'Non précisé',
        prix: trigger.getAttribute('data-prix') || 'Sur commande',
        date: trigger.getAttribute('data-date') || '',
        image: trigger.getAttribute('data-image') || ''
      };
      openModal(data);
      return;
    }

    if (target.classList.contains('modal-overlay') || target.closest('.close-x-btn')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}