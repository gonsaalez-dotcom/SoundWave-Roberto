const { Artista, Cancion } = require('../models/index');

async function runSeed() {
  try {
    // Verificar si ya hay datos
    const count = await Artista.count();
    if (count > 0) {
      console.log('Los datos ya existen, omitiendo seed');
      return;
    }

    console.log('Ejecutando seed de datos...');

    // Crear artistas
    const artistas = await Artista.bulkCreate([
      { nombre: 'Queen', genero: 'Rock', pais: 'Reino Unido' },
      { nombre: 'Daft Punk', genero: 'Electrónica', pais: 'Francia' },
      { nombre: 'Shakira', genero: 'Pop', pais: 'Colombia' },
      { nombre: 'The Beatles', genero: 'Rock', pais: 'Reino Unido' },
      { nombre: 'Bad Bunny', genero: 'Urbano', pais: 'Puerto Rico' },
    ]);

    // Crear canciones
    await Cancion.bulkCreate([
      // Queen (id: 1)
      { titulo: 'Bohemian Rhapsody', album: 'A Night at the Opera', duracion: 354, reproducciones: 150, artistaId: artistas[0].id },
      { titulo: 'We Will Rock You', album: 'News of the World', duracion: 122, reproducciones: 98, artistaId: artistas[0].id },
      { titulo: 'We Are the Champions', album: 'News of the World', duracion: 179, reproducciones: 85, artistaId: artistas[0].id },
      
      // Daft Punk (id: 2)
      { titulo: 'Get Lucky', album: 'Random Access Memories', duracion: 369, reproducciones: 210, artistaId: artistas[1].id },
      { titulo: 'Around the World', album: 'Homework', duracion: 427, reproducciones: 87, artistaId: artistas[1].id },
      { titulo: 'One More Time', album: 'Discovery', duracion: 320, reproducciones: 195, artistaId: artistas[1].id },
      
      // Shakira (id: 3)
      { titulo: 'Hips Don\'t Lie', album: 'Oral Fixation Vol. 2', duracion: 218, reproducciones: 320, artistaId: artistas[2].id },
      { titulo: 'Waka Waka', album: 'Sale el Sol', duracion: 202, reproducciones: 280, artistaId: artistas[2].id },
      { titulo: 'Suerte', album: 'Servicio de Lavandería', duracion: 195, reproducciones: 150, artistaId: artistas[2].id },
      
      // The Beatles (id: 4)
      { titulo: 'Hey Jude', album: 'The Beatles Again', duracion: 431, reproducciones: 175, artistaId: artistas[3].id },
      { titulo: 'Come Together', album: 'Abbey Road', duracion: 259, reproducciones: 142, artistaId: artistas[3].id },
      { titulo: 'Let It Be', album: 'Let It Be', duracion: 243, reproducciones: 200, artistaId: artistas[3].id },
      
      // Bad Bunny (id: 5)
      { titulo: 'Dákiti', album: 'El Último Tour Del Mundo', duracion: 205, reproducciones: 450, artistaId: artistas[4].id },
      { titulo: 'Yo Perreo Sola', album: 'YHLQMDLG', duracion: 172, reproducciones: 398, artistaId: artistas[4].id },
      { titulo: 'Tití Me Preguntó', album: 'Un Verano Sin Ti', duracion: 243, reproducciones: 380, artistaId: artistas[4].id },
    ]);

    console.log(`Carga completada: ${artistas.length} artistas, 15 canciones`);
  } catch (error) {
    console.error('Error en Carga:', error.message);
    throw error;
  }
}

module.exports = runSeed;