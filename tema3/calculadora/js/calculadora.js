(function () {
  'use strict';

  var MAX_DIGITOS = 14;
  var pantalla = document.getElementById('pantalla');
  var previa = document.getElementById('previa');
  var teclado = document.getElementById('teclado');
  var lista = document.getElementById('historial');
  var vacio = document.getElementById('historial-vacio');

  var actual = '0';      // número que se está escribiendo (texto)
  var acumulado = null;  // primer operando
  var operador = null;   // + - * /
  var nuevo = true;      // true: la siguiente cifra empieza un número nuevo
  var error = false;

  var SIMBOLO = { '+': '+', '-': '\u2212', '*': '\u00d7', '/': '\u00f7' };

  function formatear(n) {
    return String(parseFloat(n.toPrecision(12)));
  }

  function mostrar() {
    var texto = error ? actual : actual.replace('.', ',');
    pantalla.textContent = texto;
    pantalla.classList.toggle('pantalla--larga', !error && texto.length > 10);
    pantalla.classList.toggle('pantalla--error', error);
  }

  function escribirPrevia(txt) {
    previa.textContent = txt;
  }

  function calcular(x, op, y) {
    switch (op) {
      case '+': return x + y;
      case '-': return x - y;
      case '*': return x * y;
      case '/':
        if (y === 0) { throw new Error('No se puede dividir entre 0'); }
        return x / y;
      default: return y;
    }
  }

  function fallo(mensaje) {
    error = true;
    actual = mensaje;
    acumulado = null;
    operador = null;
    nuevo = true;
    escribirPrevia('');
    mostrar();
  }

  function limpiar() {
    actual = '0'; acumulado = null; operador = null; nuevo = true; error = false;
    escribirPrevia('');
    mostrar();
  }

  function anotar(texto) {
    vacio.hidden = true;
    var li = document.createElement('li');
    li.textContent = texto.replace(/\./g, ',');
    lista.insertBefore(li, lista.firstChild);
    while (lista.children.length > 8) { lista.removeChild(lista.lastChild); }
  }

  function digito(d) {
    if (nuevo) { actual = d; nuevo = false; }
    else if (actual.replace(/[-.]/g, '').length < MAX_DIGITOS) {
      actual = actual === '0' ? d : (actual === '-0' ? '-' + d : actual + d);
    }
    mostrar();
  }

  function punto() {
    if (nuevo) { actual = '0.'; nuevo = false; }
    else if (actual.indexOf('.') === -1) { actual += '.'; }
    mostrar();
  }

  function elegirOperador(op) {
    var valor = parseFloat(actual);
    if (operador && !nuevo) {
      try {
        valor = calcular(acumulado, operador, valor);
      } catch (e) { fallo(e.message); return; }
      actual = formatear(valor);
    }
    acumulado = valor;
    operador = op;
    nuevo = true;
    escribirPrevia(formatear(acumulado).replace('.', ',') + ' ' + SIMBOLO[op]);
    mostrar();
  }

  function igual() {
    if (!operador) { return; }
    var b = parseFloat(actual);
    var a = acumulado;
    var resultado;
    try {
      resultado = calcular(a, operador, b);
    } catch (e) { fallo(e.message); return; }
    if (!isFinite(resultado)) { fallo('Resultado demasiado grande'); return; }
    var operacion = formatear(a) + ' ' + SIMBOLO[operador] + ' ' + formatear(b);
    actual = formatear(resultado);
    escribirPrevia(operacion.replace(/\./g, ',') + ' =');
    anotar(operacion + ' = ' + actual);
    acumulado = null; operador = null; nuevo = true;
    mostrar();
  }

  function porcentaje() {
    var v = parseFloat(actual);
    actual = formatear(operador && acumulado !== null ? acumulado * v / 100 : v / 100);
    nuevo = false;
    mostrar();
  }

  function signo() {
    if (actual === '0') { return; }
    actual = actual.charAt(0) === '-' ? actual.slice(1) : '-' + actual;
    mostrar();
  }

  function borrar() {
    if (nuevo) { return; }
    actual = actual.slice(0, -1);
    if (actual === '' || actual === '-') { actual = '0'; nuevo = true; }
    mostrar();
  }

  var acciones = {
    digito: function (b) { digito(b.dataset.valor); },
    punto: punto,
    operador: function (b) { elegirOperador(b.dataset.valor); },
    igual: igual,
    porcentaje: porcentaje,
    signo: signo,
    borrar: borrar,
    limpiar: limpiar
  };

  teclado.addEventListener('click', function (e) {
    var boton = e.target.closest('button[data-accion]');
    if (!boton) { return; }
    var accion = boton.dataset.accion;
    if (error && accion !== 'limpiar') { limpiar(); }
    acciones[accion](boton);
  });

  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) { return; }
    var tecla = e.key === ',' ? '.' : (e.key === '=' ? 'Enter' : e.key);
    var boton = teclado.querySelector('[data-tecla="' + tecla.replace(/"/g, '') + '"]');
    if (!boton) { return; }
    e.preventDefault();
    boton.click();
    boton.classList.add('pulsada');
    window.setTimeout(function () { boton.classList.remove('pulsada'); }, 120);
  });

  mostrar();
})();
