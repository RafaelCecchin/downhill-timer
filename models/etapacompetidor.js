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
    static async findCompetidoresByEtapaId(etapaId) {
      return new Promise(
        async function(resolve, reject) {
            let competidoresArray = [];
            const etapaCompetidoresObjs = await EtapaCompetidor.findAll({
                include: [ 
                    {
                        association: 'competidor',
                        include: ['genero']
                    }, 
                    {
                        association: 'categoria'
                    } 
                ],
                where: {
                    etapaId: etapaId
                }
            });            
            
            for (const etapaCompetidor of etapaCompetidoresObjs) {
                const genero = etapaCompetidor.get('competidor').get('genero');
                const categoria = etapaCompetidor.get('categoria');
                
                if (!competidoresArray[genero.get('id')]) {
                     competidoresArray[genero.get('id')] = new Object();
                     competidoresArray[genero.get('id')].genero = genero;
                     competidoresArray[genero.get('id')].categorias = [];
                }

                if (!competidoresArray[genero.get('id')].categorias[categoria.get('id')]) {
                     competidoresArray[genero.get('id')].categorias[categoria.get('id')] = new Object();
                     competidoresArray[genero.get('id')].categorias[categoria.get('id')].categoria = categoria;
                     competidoresArray[genero.get('id')].categorias[categoria.get('id')].competidores = [];                    
                }

                competidoresArray[genero.get('id')]
                    .categorias[categoria.get('id')]
                    .competidores
                    .push(etapaCompetidor);
            }

            resolve(competidoresArray);
        }
      );   
    }
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
        if (!this.getDataValue('dci')) {
          return '00:00:00';
        }

        const date = this.getDataValue('dci');

        let h = String(date.getHours()).padStart(2, '0');
        let m = String(date.getMinutes()).padStart(2, '0');
        let s = String(date.getSeconds()).padStart(2, '0');

        return h + ':' + m + ':' + s;
      }
    },
    dcf: {
      type: DataTypes.DATE,
      get() {
        if (!this.getDataValue('dcf')) {
          return '00:00:00';
        }

        const date = this.getDataValue('dcf');

        let h = String(date.getHours()).padStart(2, '0');
        let m = String(date.getMinutes()).padStart(2, '0');
        let s = String(date.getSeconds()).padStart(2, '0');

        return h + ':' + m + ':' + s;
      }
    },
    dct: {
      type: DataTypes.VIRTUAL,
      get() {
        return '00:00:00';
      }
    },
    pi: {
      type: DataTypes.DATE,
      get() {
        if (!this.getDataValue('pi')) {
          return '00:00:00';
        }

        const date = this.getDataValue('pi');

        let h = String(date.getHours()).padStart(2, '0');
        let m = String(date.getMinutes()).padStart(2, '0');
        let s = String(date.getSeconds()).padStart(2, '0');

        return h + ':' + m + ':' + s;
      }
    },
    pf: {
      type: DataTypes.DATE,
      get() {
        if (!this.getDataValue('pf')) {
          return '00:00:00';
        }

        const date = this.getDataValue('pf');

        let h = String(date.getHours()).padStart(2, '0');
        let m = String(date.getMinutes()).padStart(2, '0');
        let s = String(date.getSeconds()).padStart(2, '0');

        return h + ':' + m + ':' + s;
      }
    },
    pt: {
      type: DataTypes.VIRTUAL,
      get() {
        return '00:00:00';
      }
    }
  }, {
    sequelize,
    modelName: 'EtapaCompetidor',
    tableName: 'EtapaCompetidores'
  });
  return EtapaCompetidor;
};