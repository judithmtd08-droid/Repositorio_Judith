(function () {
  'use strict';

  var OPCIONES = {
    piedra: { emoji: '\u270A', nombre: 'Piedra', vence: 'tijera' },
    papel:  { emoji: '\u270B', nombre: 'Papel',  vence: 'piedra' },
    tijera: { emoji: '\u270C\uFE0F', nombre: 'Tijera', vence: 'papel' }
  };
  var CLAVES = Object.keys(OPCIONES);

  var el = {
    elecciones: document.getElementById('elecciones'),
    emojiJ: document.getElementById('emoji-jugador'),
    emojiM: document.getElementById('emoji-maquina'),
    nombreJ: document.getElementById('nombre-jugador'),
    nombreM: document.getElementById('nombre-maquina'),
    manoM: document.getElementById('mano-maquina'),
    resultado: document.getElementById('resultado'),
    pJ: document.getElementById('p-jugador'),
    pM: document.getElementById('p-maquina'),
    pE: document.getElementById('p-empates'),
    historial: document.getElementById('historial'),
    reiniciar: document.getElementById('reiniciar')
  };

  var puntos = { jugador: 0, maquina: 0, empates: 0 };
  var ocupado = false;
  var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function aleatoria() {
    return CLAVES[Math.floor(Math.random() * CLAVES.length)];
  }

  function decidir(jugador, maquina) {
    if (jugador === maquina) { return 'empate'; }
    return OPCIONES[jugador].vence === maquina ? 'gana' : 'pierde';
  }

  function bloquear(si) {
    ocupado = si;
    el.elecciones.querySelectorAll('button').forEach(function (b) { b.disabled = si; });
  }

  function apuntar(res) {
    var li = document.createElement('li');
    li.className = res === 'gana' ? 'g' : (res === 'pierde' ? 'p' : 'e');
    li.textContent = res === 'gana' ? 'G' : (res === 'pierde' ? 'P' : 'E');
    li.title = res === 'gana' ? 'Ganaste' : (res === 'pierde' ? 'Perdiste' : 'Empate');
    el.historial.insertBefore(li, el.historial.firstChild);
    while (el.historial.children.length > 10) { el.historial.removeChild(el.historial.lastChild); }
  }

  function terminar(jugador, maquina) {
    var res = decidir(jugador, maquina);
    el.manoM.classList.remove('mano--sacude');
    el.emojiM.textContent = OPCIONES[maquina].emoji;
    el.nombreM.textContent = OPCIONES[maquina].nombre;
    el.resultado.className = 'resultado resultado--' + res;
    if (res === 'gana') { puntos.jugador++; el.resultado.textContent = '\u00a1Ganas! ' + OPCIONES[jugador].nombre + ' vence a ' + OPCIONES[maquina].nombre.toLowerCase(); }
    else if (res === 'pierde') { puntos.maquina++; el.resultado.textContent = 'Pierdes. ' + OPCIONES[maquina].nombre + ' vence a ' + OPCIONES[jugador].nombre.toLowerCase(); }
    else { puntos.empates++; el.resultado.textContent = 'Empate: los dos habéis sacado ' + OPCIONES[jugador].nombre.toLowerCase(); }
    el.pJ.textContent = puntos.jugador;
    el.pM.textContent = puntos.maquina;
    el.pE.textContent = puntos.empates;
    apuntar(res);
    bloquear(false);
  }

  function jugar(jugador) {
    if (ocupado) { return; }
    bloquear(true);
    el.emojiJ.textContent = OPCIONES[jugador].emoji;
    el.nombreJ.textContent = OPCIONES[jugador].nombre;
    el.resultado.className = 'resultado';
    el.resultado.textContent = 'El ordenador está eligiendo...';
    var maquina = aleatoria();

    if (sinMovimiento) { terminar(jugador, maquina); return; }

    el.manoM.classList.add('mano--sacude');
    el.nombreM.textContent = '...';
    var vueltas = 0;
    var barajar = window.setInterval(function () {
      el.emojiM.textContent = OPCIONES[aleatoria()].emoji;
      vueltas++;
      if (vueltas >= 8) {
        window.clearInterval(barajar);
        terminar(jugador, maquina);
      }
    }, 90);
  }

  el.elecciones.addEventListener('click', function (e) {
    var boton = e.target.closest('button[data-eleccion]');
    if (boton) { jugar(boton.dataset.eleccion); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) { return; }
    var indice = ['1', '2', '3'].indexOf(e.key);
    if (indice !== -1) { jugar(CLAVES[indice]); }
  });

  el.reiniciar.addEventListener('click', function () {
    puntos = { jugador: 0, maquina: 0, empates: 0 };
    el.pJ.textContent = '0'; el.pM.textContent = '0'; el.pE.textContent = '0';
    el.emojiJ.textContent = '\u2754'; el.emojiM.textContent = '\u2754';
    el.nombreJ.textContent = 'Tu jugada'; el.nombreM.textContent = 'Ordenador';
    el.resultado.className = 'resultado';
    el.resultado.textContent = 'Elige una opción para empezar';
    el.historial.textContent = '';
  });
})();
