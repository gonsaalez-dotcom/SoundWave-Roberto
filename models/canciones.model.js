const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cancion = sequelize.define('Cancion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El título de la canción es obligatorio' },
      },
    },
    album: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        isInt: true,
      },
    },
    reproducciones: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    artistaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'artistas',
        key: 'id',
      },
    },
  }, {
    tableName: 'canciones',
    timestamps: false,
  });

  return Cancion;
};