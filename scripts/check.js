require('dotenv').config();
const sequelize = require('../config/database');
const { Artista, Cancion } = require('../models/index');

async function check() {
  console.log('\nVERIFICANDO BASE DE DATOS\n');

  // 1. Probar conexion
  try {
    await sequelize.authenticate();
    console.log('Conexion OK');
  } catch (error) {
    console.log('Error de conexion. Revisa que PostgreSQL este corriendo');
    process.exit(1);
  }

  // 2. Contar registros
  const artistas = await Artista.count();
  const canciones = await Cancion.count();
  
  console.log('Artistas: ' + artistas);
  console.log('Canciones: ' + canciones);

  console.log('\nTodo listo para trabajar\n');
  process.exit(0);
}

check();