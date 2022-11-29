'use strict';

const models = require('../models');

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
    static async existsEtapaCompetidoresCategoria(categoriaId) {
      let etapaCompetidores = await sequelize.models.EtapaCompetidor.findAll({ 
          where: { 
            categoriaId: categoriaId
          } 
      });

      return etapaCompetidores.length ? true : false;
    }
    static async validateExclude(categoriaId) {
      if (await Categoria.existsEtapaCompetidoresCategoria(
        categoriaId
      )) {
        throw new Error('Existem competidores cadastrados nessa categoria.');
      }
    }
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
    hooks: {
      beforeDestroy: async (categoria, options) => {
        await Categoria.validateExclude(
          categoria.getDataValue('id')
        );
      }
    },
    sequelize,
    modelName: 'Categoria',
    tableName: 'Categorias',
  });
  return Categoria;
};