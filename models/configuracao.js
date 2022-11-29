'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Configuracao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Configuracao.init({
    portaCom: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Configuracao',
    tableName: 'Configuracoes'
  });
  return Configuracao;
};