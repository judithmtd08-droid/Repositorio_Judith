(function () {
  'use strict';
  var form = document.getElementById('inscripcion');
  var texto = document.getElementById('comentarios');
  var contador = document.getElementById('contador');
  var mensaje = document.getElementById('mensaje');
  if (!form) { return; }

  function actualizar() {
    contador.textContent = texto.value.length + ' / ' + texto.maxLength;
  }
  texto.addEventListener('input', actualizar);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var nombre = document.getElementById('nombre').value.trim();
    mensaje.textContent = 'Gracias, ' + nombre + ': hemos recibido tu inscripción.';
    mensaje.hidden = false;
    mensaje.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  form.addEventListener('reset', function () {
    mensaje.hidden = true;
    window.setTimeout(actualizar, 0);
  });
  actualizar();
})();
