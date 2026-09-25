// src/scripts/features/popupform.js

export function popupform() {
  const forms = document.querySelectorAll('form[action="/contact.php"]');
  const merciPopup = document.getElementById('merci-popup');

  if (forms.length === 0 || !merciPopup) return;

  forms.forEach(form => {
    if (form.dataset.initialized === 'true') return;
    form.dataset.initialized = 'true';

    // 1. Déclenchement du chronomètre dès que l'utilisateur interagit avec le formulaire
    let formStartTime = Date.now();
    const timerInput = form.querySelector('input[name="_form_timer"]');
    if (timerInput) timerInput.value = formStartTime.toString();

    form.addEventListener('focusin', () => {
      if (!timerInput.value) {
        timerInput.value = Date.now().toString();
      }
    }, { once: true });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      // 2. Création des données avec jeton d'interaction JS
      const formData = new FormData(form);
      formData.append('_js_timestamp', Date.now().toString());

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const bookingModal = document.getElementById('booking-modal');
          if (bookingModal) {
            bookingModal.classList.remove('visible-fade');
            document.body.classList.remove('active-modal');
          }

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
          if (timerInput) timerInput.value = Date.now().toString();
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

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-merci') || e.target === merciPopup) {
      merciPopup.classList.add('hidden');
      merciPopup.classList.remove('flex');
    }
  });
}