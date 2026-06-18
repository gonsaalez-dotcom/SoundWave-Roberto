const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Artista = sequelize.define('Artista', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre del artista es obligatorio' },
      },
    },
    genero: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pais: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imagenFondo: {
    type: DataTypes.STRING,
    allowNull: true // Se permite null por si un artista no tiene imagen de fondo
    }
  }, {
    tableName: 'artistas',
    timestamps: false,
  });

  return Artista;
};