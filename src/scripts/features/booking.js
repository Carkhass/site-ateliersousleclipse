export function initBooking() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('a[href*="#contact?ref="]');
    if (btn) {
      const urlParts = btn.href.split('?ref=');
      if (urlParts.length > 1) {
        const refCouteau = decodeURIComponent(urlParts[1]);
        const messageField = document.querySelector('textarea[name="message"]');
        if (messageField) {
          messageField.value = `Bonjour Yann,\n\nJe souhaiterais réserver le couteau "${refCouteau}". Est-il encore disponible ?\n\nMerci d'avance !`;
          messageField.focus();
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  });
}