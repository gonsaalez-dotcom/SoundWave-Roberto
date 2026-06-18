document.addEventListener('DOMContentLoaded', () => {
  const durationElement = document.querySelector('.duration-formatter');
  if (durationElement) {
    const totalSeconds = parseInt(durationElement.getAttribute('data-seconds'), 10);
    if (!isNaN(totalSeconds)) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      durationElement.innerHTML = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }
});
