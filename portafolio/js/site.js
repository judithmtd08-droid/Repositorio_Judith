(function () {
  'use strict';

  var raiz = document.documentElement;
  var boton = document.querySelector('.tema-toggle');
  if (boton) {
    boton.addEventListener('click', function () {
      var oscuro = raiz.getAttribute('data-tema') === 'oscuro';
      var nuevo = oscuro ? 'claro' : 'oscuro';
      raiz.setAttribute('data-tema', nuevo);
      try { localStorage.setItem('tema', nuevo); } catch (e) { /* sin almacenamiento */ }
    });
  }

  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var abierto = menu.classList.toggle('abierto');
      burger.setAttribute('aria-expanded', String(abierto));
      burger.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('abierto')) {
        menu.classList.remove('abierto');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }

  var anio = document.querySelector('[data-anio]');
  if (anio) { anio.textContent = new Date().getFullYear(); }
})();
