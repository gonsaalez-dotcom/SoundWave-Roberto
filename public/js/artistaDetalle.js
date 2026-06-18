document.addEventListener('DOMContentLoaded', () => {
  // Autonumerar las filas de la tabla
  document.querySelectorAll('.row-number-cell').forEach((cell, index) => {
    cell.textContent = index + 1;
  });

  // Formatear duración de segundos a MM:SS
  document.querySelectorAll('.duration-formatter').forEach(element => {
    const totalSeconds = parseInt(element.getAttribute('data-seconds'), 10);
    if (!isNaN(totalSeconds)) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      element.innerHTML = `<i class="far fa-clock text-muted me-1"></i>${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  });
});
