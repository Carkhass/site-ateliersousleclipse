export function popupform() {
  const forms = document.querySelectorAll('.contact-form');
  const merciPopup = document.getElementById('merci-popup');
  const bookingModal = document.getElementById('booking-modal');

  if (forms.length === 0 || !merciPopup) return;

  forms.forEach(form => {
    // ANTI-DOUBLON : On ne met qu'un seul écouteur par formulaire
    if (form.dataset.initialized === 'true') return;
    form.dataset.initialized = 'true';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          // 1. Fermer la modale de réservation si elle est ouverte
          if (bookingModal) {
            bookingModal.classList.add('hidden');
            bookingModal.classList.remove('flex', 'visible-fade');
          }

          // 2. Afficher la popup Merci (Le conteneur parent)
          merciPopup.classList.remove('hidden');
          merciPopup.classList.add('flex');

          // 3. Animation du contenu (On force l'opacité à 100)
          const content = merciPopup.querySelector('div.relative');
          const merciImage = document.getElementById('merci-image');

          setTimeout(() => {
            if (content) {
              content.classList.remove('scale-95', 'opacity-0');
              content.classList.add('scale-100', 'opacity-100');
            }
            if (merciImage) {
              merciImage.classList.remove('opacity-0', 'scale-90');
              merciImage.classList.add('opacity-100', 'scale-100');
            }
          }, 50);

          form.reset();
          // On bloque le scroll pour que l'utilisateur lise la popup
          document.body.style.overflow = 'hidden';

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

  // GESTION DE LA FERMETURE (Clic sur bouton ou fond noir)
  if (!merciPopup.dataset.listener) {
    merciPopup.addEventListener('click', (e) => {
      const isButton = e.target.closest('button');
      const isBackdrop = e.target === merciPopup || e.target.classList.contains('bg-black/60');

      if (isButton || isBackdrop) {
        merciPopup.classList.add('hidden');
        merciPopup.classList.remove('flex');
        
        // On rend le scroll au site
        document.body.style.overflow = '';
      }
    });
    merciPopup.dataset.listener = 'true';
  }
}