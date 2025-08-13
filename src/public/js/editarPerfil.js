document.addEventListener('DOMContentLoaded', () => {
  const toggleEditBtn = document.getElementById('toggleEdit');
  const perfilForm = document.getElementById('perfilForm'); // 🔧 NUEVO
  let isEditing = false;

  toggleEditBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isEditing = !isEditing;

    const userPhotoBlock = document.querySelector('.user-photo');
    userPhotoBlock.classList.toggle('show-image-input', isEditing);

    const fields = document.querySelectorAll(isEditing ? '.editable' : '.input-editable');

    fields.forEach(el => {
      const key = el.dataset.key;

      if (isEditing) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = el.textContent.trim();
        input.dataset.key = key;
        input.classList.add('input-editable');
        el.replaceWith(input);
      } else {
        const newSpan = document.createElement('span');
        newSpan.classList.add('editable');
        newSpan.dataset.key = key;
        newSpan.textContent = el.value.trim();
        el.replaceWith(newSpan);

        // 🔧 NUEVO: agregar campo oculto al form
        let hiddenInput = perfilForm.querySelector(`[name="${key}"]`);
        if (!hiddenInput) {
          hiddenInput = document.createElement('input');
          hiddenInput.type = 'hidden';
          hiddenInput.name = key;
          perfilForm.appendChild(hiddenInput);
        }
        hiddenInput.value = el.value.trim();
      }
    });

    toggleEditBtn.textContent = isEditing ? 'Guardar cambios' : 'Editar perfil';

    const imageInput = document.getElementById('image');
    if (!perfilForm.contains(imageInput) && imageInput.files.length > 0) {
      perfilForm.appendChild(imageInput); // ✅ Mueve el input original al form
    }


    // 🔧 NUEVO: enviar el formulario si se está guardando
    if (!isEditing) {
      perfilForm.submit();
    }
  });
});