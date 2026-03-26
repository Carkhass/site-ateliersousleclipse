export function initBookingLogic() {
  const modal = document.getElementById('booking-modal');
  const openBtns = document.querySelectorAll('.open-booking-modal');
  const closeBtns = document.querySelectorAll('.close-booking');
  
  const titleField = document.getElementById('booking-title');
  const refInput = document.getElementById('booking-ref-input');
  const refDisplay = document.getElementById('booking-ref-display');
  const messageField = document.getElementById('booking-message');
  const submitBtn = document.getElementById('booking-submit-btn');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const ref = btn.getAttribute('data-ref') || '';
      const isDispo = btn.getAttribute('data-dispo') === 'true';
      
      // 1. Mise à jour des références
      if(refInput) refInput.value = ref;
      if(refDisplay) refDisplay.textContent = `Modèle : ${ref}`;
      
      // 2. Logique dynamique selon disponibilité
      if (isDispo) {
        if(titleField) titleField.textContent = "Réserver cette pièce";
        if(submitBtn) submitBtn.textContent = "Confirmer la réservation";
        if(messageField) {
          messageField.value = `Bonjour, je souhaiterais réserver le couteau "${ref}". Pouvez-vous me recontacter ?`;
        }
      } else {
        if(titleField) titleField.textContent = `Commander un ${ref}`;
        if(submitBtn) submitBtn.textContent = "Envoyer ma demande de commande";
        if(messageField) {
          messageField.value = `Bonjour, je souhaiterais commander un couteau modèle "${ref}". \n\nJ'ai une préférence pour cette essence de bois pour le manche : \n(Indiquez ici vos souhaits...)`;
        }
      }
      
      // 3. Affichage avec ta classe habituelle
      modal.classList.add('visible-fade');
      document.body.style.overflow = 'hidden'; 
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('visible-fade');
      document.body.style.overflow = '';
    });
  });
}