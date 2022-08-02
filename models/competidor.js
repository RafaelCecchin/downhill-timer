'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Competidor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Competidor.belongsTo(models.Genero, {foreignKey: 'generoId', as: 'genero'})
    }
  }
  Competidor.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    nascimento: {
      type: DataTypes.DATE
    },
    patrocinador: DataTypes.STRING,
    generoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Competidor',
    tableName: 'Competidores'
  });
  return Competidor;
};