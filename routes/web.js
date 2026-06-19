const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

// Configuración local de Multer para las rutas web
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads')); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({ storage });

// Importación del controlador de vistas
const viewsController = require('../controllers/views.Controller');

// ==========================================
// Vistas principales (Pintan pantallas)
// ==========================================
router.get('/artista/nuevo', viewsController.formularioNuevoArtista);
router.get('/artista/:id/editar', viewsController.formularioEditarArtista);
router.get('/cancion/nueva', (req, res, next) => {
  if (typeof viewsController.formularioNuevaCancion === 'function') {
    return viewsController.formularioNuevaCancion(req, res, next);
  }
  res.status(500).send('Error interno: El controlador de la vista no está definido correctamente.');
});
router.get('/cancion/nueva', viewsController.formularioNuevaCancion);
router.get('/artista/:id', viewsController.detalleArtista);
router.get('/shuffle', viewsController.shuffle);
router.get('/', viewsController.home);

// ==========================================
// Procesamiento de Formularios (Acciones POST)
// ==========================================

// Se agrega upload.single('imagenFondo') al crear artista desde la web
router.post('/artista', upload.single('imagenFondo'), viewsController.crearArtista);

// Se agrega upload.single('imagenFondo') al editar artista desde la web
router.post('/artista/:id/editar', upload.single('imagenFondo'), viewsController.actualizarArtista);

router.post('/artista/:id/cancion', viewsController.crearCancion);

// Ruta para sumar reproducciones
router.post('/api/reproducir/:id', viewsController.reproducirCancionApi);

// Ruta Crear Canción
router.post('/cancion/nueva', async (req, res) => {
  try {
    req.params.id = req.body.artistaId; 
    await viewsController.crearCancion(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al procesar la creación de la canción');
  }
});

// Eliminar
router.post('/artista/:id/eliminar', viewsController.eliminarArtista);
router.post('/cancion/:id/eliminar', viewsController.eliminarCancion);


// 2. Al pulsar "Guardar", se envían los datos a tu función "crearCancion".
// NOTA: Como tu función original usa "req.params.id", cambiamos el formulario POST para enviar 
// la canción directamente al artista usando el "artistaId" que el cliente elija en la pantalla.
router.post('/cancion/nueva', async (req, res) => {
  try {
    req.params.id = req.body.artistaId; 
    await viewsController.crearCancion(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al procesar la creación de la canción');
  }
});

module.exports = router;