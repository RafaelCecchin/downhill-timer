'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Etapa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Etapa.belongsTo(models.Campeonato, {foreignKey: 'campeonatoId', as: 'campeonato'})
    }
  }
  Etapa.init({
    campeonatoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    data: {
      type: DataTypes.DATE,
    }
  }, {
    sequelize,
    modelName: 'Etapa',
  });
  return Etapa;
};