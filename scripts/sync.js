const sequelize = require('../config/database');
const { Artista, Cancion } = require('../models/index');
const runSeed = require('../seeders/seed');

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a PostgreSQL');

    await sequelize.sync({ force: true });
    console.log('Tablas creadas');

    await runSeed();
    console.log('Datos cargados');

    console.log('Base de datos lista');
    process.exit(0); 
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

syncDatabase();