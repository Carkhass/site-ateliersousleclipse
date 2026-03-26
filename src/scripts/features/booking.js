export function initBooking() {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;

  // 1. Fonctions de manipulation simples
  const openModal = () => {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  // 2. Écouteur d'OUVERTURE (Délégation ciblée)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.open-booking-modal');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation(); // Empeche le clic de remonter et de déclencher la fermeture

    const ref = btn.getAttribute('data-ref');
    const isDispo = btn.getAttribute('data-dispo') === 'true';

    // Remplissage
    const title = document.getElementById('booking-title');
    const refDisplay = document.getElementById('booking-ref-display');
    const refInput = document.getElementById('booking-ref-input');
    const messageArea = document.getElementById('booking-message');

    if (title) title.innerText = isDispo ? "Réserver ce couteau" : "Demander une création";
    if (refDisplay) refDisplay.innerText = `Référence : ${ref}`;
    if (refInput) refInput.value = ref;
    
    if (messageArea) {
      messageArea.value = isDispo 
        ? `Bonjour Yann,\n\nJe souhaiterais réserver le couteau "${ref}". Est-il encore disponible ?\n\nMerci d'avance !`
        : `Bonjour Yann,\n\nJe suis intéressé par le modèle "${ref}" et j'aimerais discuter d'une commande personnalisée.\n\nMerci d'avance !`;
    }

    openModal();
  });

  // 3. Écouteur de FERMETURE (Uniquement si la modale est cliquée)
  modal.addEventListener('click', (e) => {
    // Si on clique sur la croix OU sur le fond sombre (l'overlay lui-même)
    if (e.target === modal || e.target.closest('.close-booking')) {
      closeModal();
    }
  });

  // 4. Touche Echap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}