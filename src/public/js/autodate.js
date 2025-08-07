window.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('loginDate');
  if (!dateInput) return; // Evita errores si el campo no existe

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');

  dateInput.value = `${yyyy}-${mm}-${dd}`;
});