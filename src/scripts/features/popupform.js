export function popupform() {
  // On cible toutes les instances du formulaire
  const forms = document.querySelectorAll('.contact-form');
  const merciPopup = document.getElementById('merci-popup');
  const merciImage = document.getElementById('merci-image');
  const bookingModal = document.getElementById('booking-modal');

  if (forms.length === 0 || !merciPopup) return;

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // STOP la redirection vers contact.php

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          // 1. On ferme la modale de réservation immédiatement si elle est ouverte
          if (bookingModal) {
            // On retire la classe d'animation pour qu'elle disparaisse en dessous
            bookingModal.classList.remove('visible-fade');
            // On peut la passer en hidden après un court délai ou directement
            setTimeout(() => {
              bookingModal.classList.add('hidden');
              bookingModal.classList.remove('flex');
            }, 400);
          }

          // 2. On affiche la popup de succès
          merciPopup.classList.remove('hidden');
          merciPopup.classList.add('flex');

          // 3. Animation d'entrée de la popup Merci
          setTimeout(() => {
            const content = merciPopup.querySelector('div.relative');
            if (content) {
              content.classList.remove('scale-95', 'opacity-0');
              content.classList.add('scale-100', 'opacity-100');
            }
            if (merciImage) {
              merciImage.classList.remove('opacity-0', 'scale-90');
              merciImage.classList.add('opacity-100', 'scale-100');
            }
          }, 10);

          form.reset();
        } else {
          alert("Une erreur est survenue lors de l'envoi.");
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
    });
  });

  // Fermeture de la popup merci et nettoyage final
  merciPopup.addEventListener('click', (e) => {
    const isButton = e.target.closest('button');
    const isBackdrop = e.target.classList.contains('bg-black/80');

    if (isButton || isBackdrop) {
      // On cache la popup merci
      merciPopup.classList.add('hidden');
      merciPopup.classList.remove('flex');
      
      // Sécurité : on s'assure que la modale de réservation est bien fermée
      if (bookingModal) {
        bookingModal.classList.remove('visible-fade');
        setTimeout(() => {
            bookingModal.classList.add('hidden');
            bookingModal.classList.remove('flex');
        }, 400);
      }

      // On rend le scroll au site
      document.body.style.overflow = '';
    }
  });
}