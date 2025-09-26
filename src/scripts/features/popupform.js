// src/scripts/features/popupform.js
export function popupform() {
  const form = document.getElementById('contact-form');
  const popup = document.getElementById('merci-popup');
  const popupContent = popup?.querySelector('div');
  const merciImage = document.getElementById('merci-image');
  const closeBtn = popup?.querySelector('button');

  if (!form || !popup || !popupContent || !merciImage || !closeBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    try {
      const res = await fetch(form.action, { method: 'POST', body: data });
      if (res.ok) {
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
    setTimeout(() => popup.classList.add('hidden'), 300);
  }
}
