document.addEventListener('DOMContentLoaded', () => {
  const botones = document.querySelectorAll('.categorias button');
  const inputCategoria = document.getElementById('categoryInput');
  const formulario = document.querySelector('form');
  const precioContainer = document.getElementById('precioContainer');
  const precioInput = document.getElementById('precio');

  if (!botones.length || !inputCategoria || !formulario) return;

  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      // Quitar selección previa
      botones.forEach(b => b.classList.remove('seleccionado'));

      // Marcar el botón actual
      boton.classList.add('seleccionado');

      // Guardar el valor en el input oculto
      const categoriaSeleccionada = boton.textContent.trim().toLowerCase();
      inputCategoria.value = categoriaSeleccionada;

      // Mostrar u ocultar el campo de precio
      if (precioContainer) {
        const esOferta = categoriaSeleccionada === 'oferta';
        precioContainer.style.display = esOferta ? 'block' : 'none';

        // Limpiar el campo si no es oferta
        if (!esOferta && precioInput) {
          precioInput.value = '';
        }
      }
    });
  });

  formulario.addEventListener('submit', (e) => {
    const categoria = inputCategoria.value.trim().toLowerCase();

    if (!categoria) {
      e.preventDefault();
      alert('Por favor seleccioná una categoría antes de continuar.');
      return;
    }

    if (categoria === 'oferta' && (!precioInput.value || parseFloat(precioInput.value) <= 0)) {
      e.preventDefault();
      alert('Las ofertas deben tener un precio válido.');
      return;
    }
  });
});