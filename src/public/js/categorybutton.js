document.addEventListener('DOMContentLoaded', () => {
  const botones = document.querySelectorAll('.categorias button');
  const inputCategoria = document.getElementById('categoryInput');
  const formulario = document.querySelector('form');

  if (!botones.length || !inputCategoria || !formulario) return;

  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      // Quitar selección previa
      botones.forEach(b => b.classList.remove('seleccionado'));

      // Marcar el botón actual
      boton.classList.add('seleccionado');

      // Guardar el valor en el input oculto
      inputCategoria.value = boton.textContent.trim();
    });
  });

  formulario.addEventListener('submit', (e) => {
    if (!inputCategoria.value) {
      e.preventDefault();
      alert('Por favor seleccioná una categoría antes de continuar.');
    }
  });
});
