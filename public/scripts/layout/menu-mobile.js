(() => {
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.querySelector('.menu');
  const overlay = document.querySelector('.menu-overlay');
  if (!menuToggle || !menu || !overlay) return;

  function openMenu() {
    menu.classList.remove('closing');
    menu.classList.add('open');
    overlay.classList.add('active');
  }
  function closeMenu() {
    menu.classList.remove('open');
    menu.classList.add('closing');
    overlay.classList.remove('active');
  }

  menuToggle.addEventListener('click', openMenu);
  overlay.addEventListener('click', closeMenu);
})();
