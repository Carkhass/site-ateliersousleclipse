export function popupform() {
  const forms = document.querySelectorAll('.contact-form');
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
          // Fermer la modale de réservation (si présente)
          const bookingModal = document.getElementById('booking-modal');
          if (bookingModal) {
            bookingModal.classList.add('hidden');
            bookingModal.classList.remove('flex');
          }

          // Afficher le MERCI
          merciPopup.classList.remove('hidden');
          merciPopup.classList.add('flex');
          
          // Forcer l'opacité sans utiliser replace (plus robuste)
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
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });
}