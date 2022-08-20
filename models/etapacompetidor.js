'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EtapaCompetidor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      EtapaCompetidor.belongsTo(models.Etapa, {foreignKey: 'etapaId', as: 'etapa'}),
      EtapaCompetidor.belongsTo(models.Competidor, {foreignKey: 'competidorId', as: 'competidor'}),
      EtapaCompetidor.belongsTo(models.Categoria, {foreignKey: 'categoriaId', as: 'categoria'})
    }
  }
  EtapaCompetidor.init({
    etapaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    competidorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    placa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    rfid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    dci:{
      type: DataTypes.DATE,
      get() {
        return this.getDataValue('dci') ? this.getDataValue('dci') : '00:00:00:000';
      }
    },
    dcf: {
      type: DataTypes.DATE,
      get() {
        return this.getDataValue('dci') ? this.getDataValue('dci') : '00:00:00:000';
      }
    },
    dct: {
      type: DataTypes.VIRTUAL,
      get() {
        return '00:00:00:000';
      }
    },
    pi: {
      type: DataTypes.DATE,
      get() {
        return this.getDataValue('dci') ? this.getDataValue('dci') : '00:00:00:000';
      }
    },
    pf: {
      type: DataTypes.DATE,
      get() {
        return this.getDataValue('dci') ? this.getDataValue('dci') : '00:00:00:000';
      }
    },
    pt: {
      type: DataTypes.VIRTUAL,
      get() {
        return '00:00:00:000';
      }
    }
  }, {
    sequelize,
    modelName: 'EtapaCompetidor',
    tableName: 'EtapaCompetidores'
  });
  return EtapaCompetidor;
};