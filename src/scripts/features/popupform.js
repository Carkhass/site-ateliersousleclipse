// src/scripts/features/popupform.js

export function popupform() {
  // On cible TOUS les formulaires qui pointent vers contact.php pour être sûr
  const forms = document.querySelectorAll('form[action="/contact.php"]');
  const merciPopup = document.getElementById('merci-popup');

  if (forms.length === 0 || !merciPopup) return;

  forms.forEach(form => {
    // Évite les doubles écouteurs si Astro recharge partiellement
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
          // --- 1. FERMER LA MODALE DE RÉSERVATION (SI OUVERTE) ---
          const bookingModal = document.getElementById('booking-modal');
          if (bookingModal) {
            // On retire les classes "Premium" de global.css
            bookingModal.classList.remove('visible-fade');
            document.body.classList.remove('active-modal');
          }

          // --- 2. AFFICHER LE MERCI ---
          merciPopup.classList.remove('hidden');
          merciPopup.classList.add('flex');
          
          // On cible le conteneur interne pour l'animation
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
          }, 50);

          form.reset();
        } else {
          alert("Une erreur est survenue lors de l'envoi.");
        }
      } catch (error) {
        console.error("Erreur réseau:", error);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });
}