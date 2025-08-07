function activarEdicion(botonEditar) {
  const form = botonEditar.closest('form');
  const tr = form.closest('tr');

  // Ocultar botón editar
  botonEditar.style.display = 'none';

  // Mostrar botones guardar y cancelar
  form.querySelector('.btn-guardar').style.display = 'inline-block';
  form.querySelector('.btn-cancelar').style.display = 'inline-block';

  // Mostrar inputs y ocultar spans
  tr.querySelectorAll('span').forEach(span => span.style.display = 'none');
  tr.querySelectorAll('.edit-field').forEach(input => {
    input.hidden = false;
    input.setAttribute('data-original', input.value);
  });

  // Marcar fila como editando
  tr.classList.add('editando');
}

function cancelarEdicion(botonCancelar) {
  if (!confirm("¿Estás seguro de que querés cancelar la edición?")) return;

  const form = botonCancelar.closest('form');
  const tr = form.closest('tr');
  const botonEditar = form.querySelector('.btn-editar');

  // Ocultar botones guardar y cancelar
  form.querySelector('.btn-guardar').style.display = 'none';
  form.querySelector('.btn-cancelar').style.display = 'none';

  // Mostrar botón editar
  if (botonEditar) botonEditar.style.display = 'inline-block';

  // Mostrar spans y ocultar inputs
  tr.querySelectorAll('span').forEach(span => span.style.display = 'inline');
  tr.querySelectorAll('.edit-field').forEach(input => {
    input.hidden = true;
    const original = input.getAttribute('data-original');
    if (original !== null) input.value = original;
  });

  // Quitar clase de edición
  tr.classList.remove('editando');
}

function confirmarEliminacion() {
  return confirm("¿Estás seguro de que querés eliminar esta ruta?");
}

// Copiar valores antes de enviar el formulario
document.querySelectorAll('.edit-form').forEach(form => {
  form.addEventListener('submit', function () {
    const tr = form.closest('tr');
    form.querySelector('input[name="routeName"]').value = tr.querySelector('input[name="routeName"].edit-field').value;
    form.querySelector('input[name="transportTime"]').value = tr.querySelector('input[name="transportTime"].edit-field').value;
    form.querySelector('input[name="transportDestination"]').value = tr.querySelector('input[name="transportDestination"].edit-field').value;
    form.querySelector('input[name="transportFrecuency"]').value = tr.querySelector('input[name="transportFrecuency"].edit-field').value;
    form.querySelector('input[name="transportFee"]').value = tr.querySelector('input[name="transportFee"].edit-field').value;
    form.querySelector('input[name="tripDuration"]').value = tr.querySelector('input[name="tripDuration"].edit-field').value;
  });
});
