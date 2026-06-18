const sequelize = require('../config/database');
const ArtistaModel = require('./artistas.models');
const CancionModel = require('./canciones.model');

const Artista = ArtistaModel(sequelize);
const Cancion = CancionModel(sequelize);

Artista.hasMany(Cancion, { foreignKey: 'artistaId', as: 'canciones' });
Cancion.belongsTo(Artista, { foreignKey: 'artistaId', as: 'artista' });

module.exports = {
  sequelize,
  Artista,
  Cancion,
};