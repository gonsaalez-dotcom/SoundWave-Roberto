const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

// Configuración local de Multer para este grupo de rutas
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Apunta directamente a la carpeta pública de subidas
    cb(null, path.join(__dirname, '../public/uploads')); 
  },
  filename: (req, file, cb) => {
    // Nombre único basado en la marca de tiempo original
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({ storage });

// Importación de Controladores
const { listar, obtener, crear, actualizar, eliminar } = require('../controllers/artistas.controller');
const { getAllCanciones, getCancionById, createCancionArtista, deleteCancion, updateCancion } = require('../controllers/cancion.controller');

// ==========================================
// Rutas de artistas (MODIFICADAS CON MULTER)
// ==========================================
router.get('/artistas', listar);
router.get('/artistas/:id', obtener);

// Se agrega upload.single('imagenFondo') interceptando el input del formulario
router.post('/artistas', upload.single('imagenFondo'), crear);
router.put('/artistas/:id', upload.single('imagenFondo'), actualizar);

router.delete('/artistas/:id', eliminar);

// ==========================================
// Rutas de canciones
// ==========================================
router.get('/artistas/:id/canciones', getCancionById);
router.post('/artistas/:id/canciones', createCancionArtista);
router.get('/canciones', getAllCanciones);
router.put('/cancion/:id', updateCancion);
router.delete('/cancion/:id', deleteCancion);

module.exports = router;