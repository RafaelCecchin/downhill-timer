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
      Etapa.belongsTo(models.Campeonato, {foreignKey: 'campeonatoId', as: 'campeonato'}),
      Etapa.hasMany(models.EtapaCompetidor, {foreignKey: 'etapaId', as: 'etapaCompetidor'})
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
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notNull: false,
        notEmpty: true,
        isIn: [['0', '1', '2']],
      },
      get() {
        switch (this.getDataValue('status')) {
          case 0:
            return 'Aguardando';
            break;
          case 1:
            return 'Descida classificatória finalizada';
            break;
          case 2:
            return 'Prova finalizada';
            break;
        }
      }
    },
    data: {
      type: DataTypes.DATE,
    },
    dci: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dcf: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pi: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pf: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    hooks: {
      beforeUpdate: (etapa, options) => {
        if (etapa.changed('status')) {

          if (etapa.getDataValue('status') == 0 && etapa.previous('status') == 1) {
            etapa.setDataValue('dci', null);
            etapa.setDataValue('dcf', null);

            sequelize.models.EtapaCompetidor.update(
              { dci: null, dcf: null },
              { where: { etapaId: etapa.getDataValue('id') } }
            );
          }

          if (etapa.getDataValue('status') == 1 && etapa.previous('status') == 2) {
            etapa.setDataValue('pi', null);
            etapa.setDataValue('pf', null);

            sequelize.models.EtapaCompetidor.update(
              { pi: null, pf: null },
              { where: { etapaId: etapa.getDataValue('id') } }
            );
          }
        }

      }
    },
    sequelize,
    modelName: 'Etapa'
  });
  return Etapa;
};