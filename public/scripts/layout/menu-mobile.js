(() => {
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.querySelector('.menu-mobile');
  const overlay = document.querySelector('.menu-overlay');
  if (!menuToggle || !menu || !overlay) return;

  function openMenu() {
    menu.classList.remove('closing');
    menu.classList.add('open');
    overlay.classList.add('active');
    menuToggle.classList.add('active');
  }

  function closeMenu() {
    menu.classList.remove('open');
    menu.classList.add('closing');
    overlay.classList.remove('active');
    menuToggle.classList.remove('active');
    setTimeout(() => {
      menu.classList.remove('closing');
    }, 300);
  }

  menuToggle.addEventListener('click', () => {
    if (menu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
})();
