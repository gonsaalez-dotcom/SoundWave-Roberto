const { Artista, Cancion } = require('../models/index');

// GET /api/artistas -> lista todos
exports.listar = async (req, res) => {
  try {
    const artistas = await Artista.findAll();
    res.json(artistas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los artistas' });
  }
};

// GET /api/artistas/:id -> Obtener artista por su id con sus canciones
exports.obtener = async (req, res) => {
  try {
    const artista = await Artista.findByPk(req.params.id);
    if (!artista) return res.status(404).json({ error: 'Artista No encontrado' });
    res.json(artista);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el artista' });
  }
};

// POST /api/artistas -> crea un artista 
exports.crear = async (req, res) => {
  try {
    const { nombre, genero, pais } = req.body;
    
    // Validación
    if (!nombre || !genero || !pais) {
      return res.status(400).json({ error: 'Datos inválidos. Los campos nombre, genero y pais son obligatorios.' });
    }

    // Captura la ruta de la imagen si se subió un archivo 
    const imagenFondo = req.file ? `/uploads/${req.file.filename}` : null;

    // Se agrega 'imagenFondo' 
    const artista = await Artista.create({ nombre, genero, pais, imagenFondo });
    res.status(201).json(artista);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el artista' });
  }
};

// PUT /api/artistas/:id -> actualiza artista según su id 
exports.actualizar = async (req, res) => {
  try {
    const artista = await Artista.findByPk(req.params.id);
    if (!artista) return res.status(404).json({ error: 'Artista No encontrado' });
    
    // Preparar los datos a actualizar tomando lo que venga en el body
    const datosActualizados = { ...req.body };

    if (req.file) {
      datosActualizados.imagenFondo = `/uploads/${req.file.filename}`;
    }
    
    await artista.update(datosActualizados);
    res.json(artista);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el artista' });
  }
};

// DELETE /api/artistas/:id -> elimina artista por id
exports.eliminar = async (req, res) => {
  try {
    const artista = await Artista.findByPk(req.params.id);
    if (!artista) return res.status(404).json({ error: 'No encontrado' });
    
    await artista.destroy();
    res.json({ mensaje: 'Artista Eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el artista' });
  }
};