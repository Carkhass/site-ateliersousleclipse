export function popupform() {
  // On cible toutes les instances du formulaire
  const forms = document.querySelectorAll('.contact-form');
  const merciPopup = document.getElementById('merci-popup');
  const merciImage = document.getElementById('merci-image');

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
          // 1. Si on est dans une modale (page couteaux), on la ferme d'abord
          const bookingModal = document.getElementById('booking-modal');
          if (bookingModal) {
            bookingModal.classList.add('hidden');
            bookingModal.classList.remove('flex');
          }

          // 2. On affiche la popup de succès
          merciPopup.classList.remove('hidden');
          merciPopup.classList.add('flex');

          // 3. Petit délai pour l'animation d'entrée
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
        // Optionnel : forcer l'affichage en local pour test
        // showMerci(); 
      }
    });
  });

  // Fermeture de la popup merci
  merciPopup.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.classList.contains('absolute')) {
      merciPopup.classList.add('hidden');
      merciPopup.classList.remove('flex');
      document.body.style.overflow = '';
    }
  });
}