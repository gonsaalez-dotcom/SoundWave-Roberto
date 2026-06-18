document.addEventListener('DOMContentLoaded', () => {
  // Escuchar clics en el documento para detectar botones de reproducir
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('.btn-reproducir');
    if (!button) return;

    event.preventDefault();
    const cancionId = button.getAttribute('data-cancion-id');
    if (!cancionId) return;

    try {
      button.disabled = true;

      const response = await fetch(`/api/reproducir/${cancionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta de la red');
      }

      const data = await response.json();
      if (data.success) {
        // Buscar todos los elementos que muestran el contador de esta canción
        const counters = document.querySelectorAll(`.play-counter-${cancionId}`);
        counters.forEach(counter => {
          // Si el elemento contiene un texto simple, actualizarlo
          counter.textContent = data.reproducciones;
        });
      } else {
        console.error('Error al registrar reproducción:', data.error);
      }
    } catch (error) {
      console.error('Error de red al registrar reproducción:', error);
    } finally {
      button.disabled = false;
    }
  });
});
