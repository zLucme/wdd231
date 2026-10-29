const botaoMenu = document.getElementById('menu-hamburguer');
const menuNav = document.getElementById('menu-navegacao');

botaoMenu.addEventListener('click', () => {
  menuNav.classList.toggle('aberto');
});