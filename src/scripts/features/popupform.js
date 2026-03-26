// src/scripts/features/popupform.js

export function popupform() {
  // On cible tous les formulaires pointant vers le PHP de l'Atelier
  const forms = document.querySelectorAll('form[action="/contact.php"]');
  const merciPopup = document.getElementById('merci-popup');

  if (forms.length === 0 || !merciPopup) return;

  forms.forEach(form => {
    if (form.dataset.initialized === 'true') return;
    form.dataset.initialized = 'true';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
        });

        if (response.ok) {
          // 1. Fermer la modale de réservation si elle est ouverte
          const bookingModal = document.getElementById('booking-modal');
          if (bookingModal) {
            bookingModal.classList.remove('visible-fade');
            document.body.classList.remove('active-modal');
          }

          // 2. Afficher le MERCI universel
          merciPopup.classList.remove('hidden');
          merciPopup.classList.add('flex');
          
          const content = merciPopup.querySelector('div.relative');
          const img = document.getElementById('merci-image');
          
          setTimeout(() => {
            if (content) {
               content.classList.remove('opacity-0', 'scale-95');
               content.classList.add('opacity-100', 'scale-100');
            }
            if (img) {
               img.classList.remove('opacity-0', 'scale-90');
               img.classList.add('opacity-100', 'scale-100');
            }
          }, 10);

          form.reset();
        } else {
          alert("Une erreur est survenue lors de l'envoi.");
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });

  // Gestion de la fermeture de la popup Merci (clic overlay ou bouton)
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-merci') || e.target === merciPopup) {
      merciPopup.classList.add('hidden');
      merciPopup.classList.remove('flex');
    }
  });
}