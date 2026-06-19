const { Artista, Cancion } = require('../models/index');
const { Op } = require('sequelize');

const viewsController = {
  // Home - listado de artistas con filtro por genero y ranking
  async home(req, res) {
    try {
      const { genero } = req.query;
      let whereCondition = {};
      
      if (genero && genero !== '') {
        whereCondition.genero = genero;
      }
      
      const artistas = await Artista.findAll({
        where: whereCondition,
        include: [{ model: Cancion, as: 'canciones' }]
      });
      
      const artistasPlanos = artistas.map(a => a.toJSON());
      
      const todosArtistas = await Artista.findAll();
      const generos = [...new Set(todosArtistas.map(a => a.genero))];
      
      const topCanciones = await Cancion.findAll({
        order: [['reproducciones', 'DESC']],
        limit: 10,
        include: [{ model: Artista, as: 'artista' }]
      });
      
      const topCancionesPlanos = topCanciones.map(c => c.toJSON());
      
      res.render('home', {
        title: 'SoundWave - Inicio',
        artistas: artistasPlanos,
        generos,
        generoSeleccionado: genero || '',
        topCanciones: topCancionesPlanos
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar la pagina');
    }
  },
  
  // Detalle de artista con sus canciones
  async detalleArtista(req, res) {
    try {
      const { id } = req.params;
      
      const artista = await Artista.findByPk(id, {
        include: [{ model: Cancion, as: 'canciones' }]
      });
      
      if (!artista) {
        return res.status(404).send('Artista no encontrado');
      }
      
      const artistaPlano = artista.toJSON();
      
      let duracionTotalSegundos = 0;
      artistaPlano.canciones.forEach(cancion => {
        duracionTotalSegundos += cancion.duracion;
      });
      
      const minutos = Math.floor(duracionTotalSegundos / 60);
      const segundos = duracionTotalSegundos % 60;
      const duracionTotal = `${minutos}:${segundos.toString().padStart(2, '0')}`;
      
      res.render('artistaDetalle', {
        title: `SoundWave - ${artistaPlano.nombre}`,
        artista: artistaPlano,
        duracionTotal
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar el artista');
    }
  },
  
  // Formulario para nuevo artista
  formularioNuevoArtista(req, res) {
    res.render('artistaForm', {
      title: 'SoundWave - Nuevo Artista',
      artista: null,
      esNuevo: true
    });
  },
  
  // Formulario para editar artista
  async formularioEditarArtista(req, res) {
    try {
      const { id } = req.params;
      const artista = await Artista.findByPk(id);
      
      if (!artista) {
        return res.status(404).send('Artista no encontrado');
      }
      
      res.render('artistaForm', {
        title: `SoundWave - Editar ${artista.nombre}`,
        artista: artista.toJSON(),
        esNuevo: false
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar el formulario');
    }
  },
  
async actualizarArtista(req, res) {
    try {
      const { id } = req.params;
      const { nombre, genero, pais } = req.body;
      
      const artista = await Artista.findByPk(id);
      if (!artista) {
        return res.status(404).send('Artista no encontrado');
      }

      const datosActualizados = { nombre, genero, pais };

      // Si se sube una nueva imagen de fondo, la actualizamos
      if (req.file) {
        datosActualizados.imagenFondo = `/uploads/${req.file.filename}`;
      }
      
      await artista.update(datosActualizados);
      res.redirect(`/artista/${id}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar el artista');
    }
  }, // <--- Esta coma y llave cierran perfectamente actualizarArtista

  async formularioNuevaCancion(req, res) {
    try {
      // Traemos todos los artistas para poblar el <select> del formulario
      const artistas = await Artista.findAll({ order: [['nombre', 'ASC']] });
      const artistasPlanos = artistas.map(a => a.toJSON());

      res.render('cancionForm', {
        title: 'SoundWave - Nueva Canción',
        artistas: artistasPlanos,
        esNuevo: true
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar el formulario de canciones');
    }
  },// <--- Esta coma separa el nuevo método del siguiente

  // Crear cancion desde formulario (Tu método original intacto)
  async crearCancion(req, res) {
    try {
      const { id } = req.params;
      const { titulo, album, duracion } = req.body;
      
      const artista = await Artista.findByPk(id);
      if (!artista) {
        return res.status(404).send('Artista no encontrado');
      }

      // Capturamos la carátula/portada de la canción con Multer
      const portada = req.file ? `/uploads/${req.file.filename}` : null;
      
      await Cancion.create({
        titulo,
        album,
        duracion: parseInt(duracion),
        artistaId: id,
        reproducciones: 0,
        portada: portada // Guardamos la ruta en PostgreSQL
      });
      
      res.redirect(`/artista/${id}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al crear la cancion');
    }
  },
  
  // Crear artista desde formulario
  async crearArtista(req, res) {
    try {
      const { nombre, genero, pais } = req.body;
      
      if (!nombre || !genero || !pais) {
        return res.status(400).send('Todos los campos son requeridos');
      }
      
      // Capturamos la imagen con Multer si existe
      const imagenFondo = req.file ? `/uploads/${req.file.filename}` : null;
      
      await Artista.create({ nombre, genero, pais, imagenFondo });
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al crear el artista');
    }
  },
  
  // Actualizar artista desde formulario
  async actualizarArtista(req, res) {
    try {
      const { id } = req.params;
      const { nombre, genero, pais } = req.body;
      
      const artista = await Artista.findByPk(id);
      if (!artista) {
        return res.status(404).send('Artista no encontrado');
      }

      const datosActualizados = { nombre, genero, pais };

      // Si se sube una nueva imagen de fondo, la actualizamos
      if (req.file) {
        datosActualizados.imagenFondo = `/uploads/${req.file.filename}`;
      }
      
      await artista.update(datosActualizados);
      res.redirect(`/artista/${id}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar el artista');
    }
  },
  
  // Crear cancion desde formulario
  async crearCancion(req, res) {
    try {
      const { id } = req.params;
      const { titulo, album, duracion } = req.body;
      
      const artista = await Artista.findByPk(id);
      if (!artista) {
        return res.status(404).send('Artista no encontrado');
      }

      // Capturamos la carátula/portada de la canción con Multer
      const portada = req.file ? `/uploads/${req.file.filename}` : null;
      
      await Cancion.create({
        titulo,
        album,
        duracion: parseInt(duracion),
        artistaId: id,
        reproducciones: 0,
        portada: portada // Guardamos la ruta en PostgreSQL
      });
      
      res.redirect(`/artista/${id}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al crear la cancion');
    }
  },
  
  // Incrementar reproducciones de una cancion
  async reproducirCancionApi(req, res) {
    try {
      const { id } = req.params;
      
      const cancion = await Cancion.findByPk(id);
      if (!cancion) {
        return res.status(404).json({ error: 'Cancion no encontrada' });
      }
      
      await cancion.increment('reproducciones');
      const cancionActualizada = await Cancion.findByPk(id);
      
      res.status(200).json({ 
        success: true, 
        reproducciones: cancionActualizada.reproducciones 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al reproducir la cancion' });
    }
  },
  
  // Eliminar artista
  async eliminarArtista(req, res) {
    try {
      const { id } = req.params;
      
      const artista = await Artista.findByPk(id);
      if (!artista) {
        return res.status(404).send('Artista no encontrado');
      }
      
      await artista.destroy();
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar el artista');
    }
  },
  
  // Eliminar cancion
  async eliminarCancion(req, res) {
    try {
      const { id } = req.params;
      
      const cancion = await Cancion.findByPk(id);
      if (!cancion) {
        return res.status(404).send('Cancion no encontrada');
      }
      
      const artistaId = cancion.artistaId;
      await cancion.destroy();
      
      res.redirect(`/artista/${artistaId}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar la cancion');
    }
  },
  
  // Shuffle - Cancion aleatoria
  async shuffle(req, res) {
    try {
      const count = await Cancion.count();
      
      if (count === 0) {
        return res.render('shuffle', {
          title: 'SoundWave - Cancion Aleatoria',
          cancion: null
        });
      }
      
      const randomIndex = Math.floor(Math.random() * count);
      
      const cancion = await Cancion.findOne({
        offset: randomIndex,
        include: [{ model: Artista, as: 'artista' }]
      });
      
      res.render('shuffle', {
        title: 'SoundWave - Cancion Aleatoria',
        cancion: cancion ? cancion.toJSON() : null
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener cancion aleatoria');
    }
  }
};

viewsController.formularioNuevaCancion = async function(req, res) {
  try {
    const { id } = req.params; // Intentamos leer el ID si venimos de la URL del artista

    if (id) {
      // FLUJO A: Venimos desde el detalle de un artista específico
      const artista = await Artista.findByPk(id);
      if (!artista) return res.status(404).send('Artista no encontrado');

      return res.render('cancionForm', {
        title: 'SoundWave - Nueva Canción',
        artista: artista.toJSON(),
        esNuevo: true
      });
    } else {
      // FLUJO B: Venimos haciendo clic desde el botón global del Home
      const artistas = await Artista.findAll({ order: [['nombre', 'ASC']] });
      const artistasPlanos = artistas.map(a => a.toJSON());

      return res.render('cancionForm', {
        title: 'SoundWave - Nueva Canción',
        artistas: artistasPlanos,
        artista: null, // Indicamos que no hay artista preseleccionado fijo
        esNuevo: true
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el formulario de canciones');
  }
};
module.exports = viewsController;