// src/scripts/features/booking-modal.js

export function initBookingLogic() {
  const modal = document.getElementById('booking-modal');
  const merciPopup = document.getElementById('merci-popup');
  
  // Sécurité : si la modale n'est pas dans le HTML, on arrête tout
  if (!modal) return;

  const closeModal = () => {
    // On retire la classe de verrouillage du scroll sur le body
    document.body.classList.remove('active-modal');
    // On retire la classe d'animation sur la modale (synchro avec global.css)
    modal.classList.remove('visible-fade');
  };

  const openModal = (ref, isDispo) => {
    const titleField = document.getElementById('modal-title');
    const refDisplay = document.getElementById('modal-ref');
    const refInput = document.getElementById('modal-input-ref');
    const messageField = document.getElementById('modal-msg');

    // Mise à jour des textes dynamiques
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

    // Déclenchement de l'affichage et de l'animation CSS
    document.body.classList.add('active-modal');
    modal.classList.add('visible-fade');
  };

  // Délégation d'événement pour intercepter tous les clics
  document.addEventListener('click', (e) => {
    const target = e.target;

    // 1. DÉTECTION DE L'OUVERTURE
    const trigger = target.closest('.trigger-booking-global');
    if (trigger) {
      const ref = trigger.getAttribute('data-ref') || '';
      const isDispo = trigger.getAttribute('data-dispo') === 'true';
      openModal(ref, isDispo);
      return; // On stoppe ici pour ce clic
    }

    // 2. DÉTECTION DE LA FERMETURE (Croix ou clic sur le fond sombre)
    if (target.classList.contains('modal-overlay') || target.closest('.close-x-btn')) {
      closeModal();
    }

    // 3. GESTION DU POPUP MERCI (après envoi du formulaire)
    if (merciPopup && !merciPopup.classList.contains('hidden')) {
      if (target.closest('.close-merci') || target === merciPopup) {
        merciPopup.classList.add('hidden');
        merciPopup.classList.remove('flex');
        closeModal();
      }
    }
  });

  // 4. SYNC AVEC L'ENVOI DU FORMULAIRE
  const form = modal.querySelector('form');
  if (form) {
    form.addEventListener('submit', () => {
      // On ferme la modale juste après l'envoi pour laisser place au "Merci"
      setTimeout(closeModal, 150);
    });
  }

  // 5. TOUCHE ECHAP (Le petit détail pro)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      if (merciPopup) {
        merciPopup.classList.add('hidden');
        merciPopup.classList.remove('flex');
      }
    }
  });
}