'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Categoria.belongsTo(models.Genero, {foreignKey: 'generoId', as: 'genero'})
    }
  }
  Categoria.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    generoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Categoria',
    tableName: 'Categorias',
  });
  return Categoria;
};