const { Cancion, Artista } = require('../models/index');

const getAllCanciones = async (req, res) => {
  try {
    const canciones = await Cancion.findAll({
      include: [{ model: Artista, as: 'artista', attributes: ['id', 'nombre', 'genero', 'pais'] }],
      order: [['id', 'ASC']],
    });
    res.json(canciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET /api/artistas/:id/canciones Lista las canciones del artista
const getCancionById = async (req, res) => {
  try {
    const { id } = req.params;
    const artista = await Artista.findByPk(id, {
      include: [{ model: Cancion, as: 'canciones', attributes: ['id', 'titulo', 'album', 'duracion', 'reproducciones'] }],
    });
    if (!artista) {
      return res.status(404).json({ error: 'Artista no encontrado' });
    }

    res.json(artista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/artistas/:id/canciones Agrega una cancion al artista
const createCancionArtista = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, album, duracion, reproducciones } = req.body;
    
    if (!titulo || !album || !duracion) {
      return res.status(400).json({ error: 'titulo, album, duracion y artistaId son obligatorios' });
    }
    const artista = await Artista.findByPk(id);
    if (!artista) {
      return res.status(404).json({ error: 'Artista no encontrado para el artistaId proporcionado' });
    }
    const nuevaCancion = await Cancion.create({
      titulo,
      album,
      duracion: parseInt(duracion),
      artistaId: id,
      reproducciones: reproducciones || 0,
    });
    res.status(201).json(nuevaCancion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/cancion/:id Actualiza una cancion al artista
const updateCancion = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, album, duracion, artistaId, reproducciones } = req.body;
    const cancion = await Cancion.findByPk(id);
    if (!cancion) {
      return res.status(404).json({ error: 'Canción no encontrada' });
    }
    if (artistaId) {
      const artista = await Artista.findByPk(artistaId);
      if (!artista) {
        return res.status(404).json({ error: 'Artista no encontrado para el artistaId proporcionado' });
      }
    }
    await cancion.update({
      titulo: titulo ?? cancion.titulo,
      album: album ?? cancion.album,
      duracion: duracion ?? cancion.duracion,
      artistaId: artistaId ?? cancion.artistaId,
      reproducciones: reproducciones ?? cancion.reproducciones,
    });
    res.json(cancion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// DELETE /api/canciones/:id Elimina una cancion
const deleteCancion = async (req, res) => {
  try {
    const { id } = req.params;
    const cancion = await Cancion.findByPk(id);
    if (!cancion) {
      return res.status(404).json({ error: 'Canción no encontrada' });
    }
    await cancion.destroy();
    res.json({ message: 'Canción eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getAllCanciones,
  getCancionById,
  createCancionArtista,
  updateCancion,
  deleteCancion,
};