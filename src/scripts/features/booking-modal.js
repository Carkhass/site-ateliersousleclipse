// src/scripts/features/booking-modal.js

export function initBookingLogic() {
  const modal = document.getElementById('booking-modal');
  
  if (!modal) return;

  const closeModal = () => {
    document.body.classList.remove('active-modal');
    modal.classList.remove('visible-fade');
  };

  const openModal = (ref, isDispo) => {
    const titleField = document.getElementById('modal-title');
    const refDisplay = document.getElementById('modal-ref');
    const refInput = document.getElementById('modal-input-ref');
    const messageField = document.getElementById('modal-msg');

    if (titleField) {
      titleField.textContent = isDispo ? "Réserver ce couteau" : "Demander une création";
    }
    if (refDisplay) {
      refDisplay.textContent = `Référence : ${ref}`;
    }
    if (refInput) {
      refInput.value = ref;
    }
    
    if (messageField) {
      messageField.value = isDispo 
        ? `Bonjour Yann,\n\nJe souhaiterais réserver le couteau "${ref}". Est-il encore disponible ?`
        : `Bonjour Yann,\n\nJe suis intéressé par le modèle "${ref}" pour une création personnalisée.`;
    }

    document.body.classList.add('active-modal');
    modal.classList.add('visible-fade');
  };

  document.addEventListener('click', (e) => {
    const target = e.target;

    // Ouverture
    const trigger = target.closest('.trigger-booking-global');
    if (trigger) {
      const ref = trigger.getAttribute('data-ref') || '';
      const isDispo = trigger.getAttribute('data-dispo') === 'true';
      openModal(ref, isDispo);
      return;
    }

    // Fermeture (Overlay ou bouton X)
    if (target.classList.contains('modal-overlay') || target.closest('.close-x-btn')) {
      closeModal();
    }
  });

  // Touche ECHAP
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}