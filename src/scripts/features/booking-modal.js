// src/scripts/features/booking-modal.js

export function initBookingLogic() {
  const modal = document.getElementById('booking-modal');
  const merciPopup = document.getElementById('merci-popup');
  if (!modal) return;

  const closeModal = () => {
    document.body.classList.remove('active-modal');
  };

  // On utilise la délégation d'événement sur le document pour être sûr 
  // que ça marche même si Astro recharge des morceaux de page
  document.addEventListener('click', (e) => {
    const target = e.target;

    // 1. OUVERTURE (via tes nouvelles classes)
    const trigger = target.closest('.trigger-booking-global');
    if (trigger) {
      const ref = trigger.getAttribute('data-ref') || '';
      const isDispo = trigger.getAttribute('data-dispo') === 'true';

      const titleField = document.getElementById('modal-title');
      const refDisplay = document.getElementById('modal-ref');
      const refInput = document.getElementById('modal-input-ref');
      const messageField = document.getElementById('modal-msg');

      if (titleField) titleField.textContent = isDispo ? "Réserver ce couteau" : "Demander une création";
      if (refDisplay) refDisplay.textContent = `Référence : ${ref}`;
      if (refInput) refInput.value = ref;
      
      if (messageField) {
        messageField.value = isDispo 
          ? `Bonjour Yann,\n\nJe souhaiterais réserver le couteau "${ref}". Est-il encore disponible ?`
          : `Bonjour Yann,\n\nJe suis intéressé par le modèle "${ref}" pour une création personnalisée.`;
      }

      document.body.classList.add('active-modal');
      return;
    }

    // 2. FERMETURE (Croix ou Overlay)
    if (target.classList.contains('modal-overlay') || target.closest('.close-x-btn')) {
      closeModal();
    }

    // 3. FERMETURE MERCI (Bouton ou fond)
    if (merciPopup && !merciPopup.classList.contains('hidden')) {
      if (target.closest('.close-merci') || target === merciPopup) {
        merciPopup.classList.add('hidden');
        merciPopup.classList.remove('flex');
        closeModal();
      }
    }
  });

  // 4. SYNC AVEC LE FORMULAIRE (pour fermer la saisie avant le merci)
  const form = modal.querySelector('form');
  if (form) {
    form.addEventListener('submit', () => {
      setTimeout(closeModal, 100);
    });
  }

  // 5. TOUCHE ECHAP
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      merciPopup?.classList.add('hidden');
    }
  });
}