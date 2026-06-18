document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('generoSelect');
  if (select) {
    const seleccionado = select.getAttribute('data-seleccionado');
    if (seleccionado) {
      select.value = seleccionado;
    }
  }
});
