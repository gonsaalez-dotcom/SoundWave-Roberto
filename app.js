require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const sequelize = require('./config/database');
const { Artista, Cancion } = require('./models/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar Handlebars
app.engine('hbs', engine({
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  defaultLayout: 'main',
  extname: '.hbs',
 }));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// === AGREGA ESTO PARA MULTER ===
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/uploads')); // Se guardan en public/uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único
  }
});
const upload = multer({ storage });
app.set('upload', upload); // Esto comparte Multer con tus rutas
// ===============================

// Rutas
const apiRoutes = require('./routes/api');
const webRoutes = require('./routes/web');

app.use('/api', apiRoutes);
app.use('/', webRoutes);

// Iniciar servidor
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexion a PostgreSQL establecida');
    
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados');
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
}

startServer();

module.exports = app;