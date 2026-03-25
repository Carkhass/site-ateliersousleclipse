// src/scripts/features/popupform.js
export function popupform() {
  const form = document.getElementById('contact-form');
  const popup = document.getElementById('merci-popup');
  const popupContent = popup?.querySelector('div');
  const merciImage = document.getElementById('merci-image');
  const closeBtn = popup?.querySelector('button');
  
  // On récupère aussi la modale qui contient le formulaire pour la fermer au succès
  const contactModal = document.getElementById('contact-modal');

  if (!form || !popup || !popupContent || !merciImage || !closeBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    try {
      const res = await fetch(form.action, { method: 'POST', body: data });
      if (res.ok) {
        // --- LE PATCH ---
        // On cache la modale du formulaire immédiatement avant le "Merci"
        if (contactModal) {
          contactModal.classList.add('hidden');
          contactModal.classList.remove('flex');
          // On ne rend pas encore le scroll au body ici car la popup Merci arrive
        }
        
        form.reset();
        showMerciPopup();
      } else {
        alert("Erreur lors de l'envoi, réessayez.");
      }
    } catch (err) {
      alert("Impossible de contacter le serveur.");
    }
  });

  closeBtn.addEventListener('click', closeMerciPopup);

  function showMerciPopup() {
    popup.classList.remove('hidden');
    popup.classList.add('flex'); // Ajouté pour le centrage
    setTimeout(() => {
      popupContent.classList.remove('scale-95', 'opacity-0');
      popupContent.classList.add('scale-100', 'opacity-100');
      // animation image
      setTimeout(() => {
        merciImage.classList.remove('opacity-0', 'scale-90');
        merciImage.classList.add('opacity-100', 'scale-100');
      }, 200);
    }, 50);
  }

  function closeMerciPopup() {
    merciImage.classList.add('opacity-0', 'scale-90');
    popupContent.classList.remove('scale-100', 'opacity-100');
    popupContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      popup.classList.add('hidden');
      popup.classList.remove('flex');
      document.body.style.overflow = ''; // On rend le scroll à la toute fin
    }, 300);
  }
}