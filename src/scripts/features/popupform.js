export function popupform() {
  const forms = document.querySelectorAll('.contact-form');
  const merciPopup = document.getElementById('merci-popup');
  const bookingModal = document.getElementById('booking-modal');

  if (forms.length === 0 || !merciPopup) return;

  forms.forEach(form => {
    // ANTI-DOUBLON : Si le formulaire a déjà été initialisé, on ne fait rien
    if (form.dataset.initialized === 'true') return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopImmediatePropagation(); // Bloque les autres scripts éventuels

      // VERROU DE BOUTON : Évite le double-clic rapide de l'utilisateur
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          // Fermeture modale booking
          if (bookingModal) {
            bookingModal.classList.remove('visible-fade');
            setTimeout(() => {
              bookingModal.classList.add('hidden');
            }, 400);
          }

          // Affichage popup merci
          merciPopup.classList.remove('hidden');
          merciPopup.classList.add('flex');

          // Reset du formulaire
          form.reset();
        } else {
          alert("Une erreur est survenue lors de l'envoi.");
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      } finally {
        // On réactive le bouton après la réponse (succès ou erreur)
        if (submitBtn) submitBtn.disabled = false;
      }
    });

    // On marque le formulaire comme initialisé
    form.dataset.initialized = 'true';
  });

  // Gestion du clic sur la popup merci (une seule fois pour le document suffirait)
  // mais on garde ta logique en ajoutant une vérification
  if (!merciPopup.dataset.listener) {
    merciPopup.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.classList.contains('bg-black/80')) {
        merciPopup.classList.add('hidden');
        merciPopup.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });
    merciPopup.dataset.listener = 'true';
  }
}