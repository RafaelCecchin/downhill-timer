'use strict';
const Helper = require('../helper/helper');
const EtapaService = require('../services/etapa');

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

            const etapa = await sequelize.models.Etapa.findByPk(etapaId, {
              include: [
                {
                  association: 'etapaCompetidor',
                  include: [
                    {
                      association: 'competidor',
                      include: ['genero']
                    },
                    {
                      association: 'categoria'
                    }
                  ]
                }
              ]
            });
            
            
            for (const etapaCompetidor of etapa.get('etapaCompetidor')) {
              
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

            competidoresArray.sort(function(a,b) {
              return a.genero.getDataValue('nome') < b.genero.getDataValue('nome') ? 1 : -1;
            });

            competidoresArray.forEach(el => {
              el.categorias.sort(function(a,b) {
                return a.categoria.getDataValue('nome') < b.categoria.getDataValue('nome') ? -1 : 1;
              });
            });

            competidoresArray.forEach(el1 => {
              el1.categorias.forEach(el2 => {
                el2.competidores.sort(function(a,b) {
                  
                  switch(etapa.getDataValue('status')) {
                    case 0:
                      return a.getDataValue('createdAt') < b.getDataValue('createdAt') ? -1 : 1;

                      break;
                    case 1:
                      return a.get('dct') > b.get('dct') ? -1 : 1;

                      break;
                    case 2:
                      return a.get('pt') < b.get('pt') ? -1 : 1;

                      break;
                  }

                });
              });
            });
            

            resolve(competidoresArray);
        }
      );   
    }
    static async existsCompetidorEtapa(competidorId, etapaId) {
      let etapaCompetidor = await EtapaCompetidor.findOne({ 
          where: { 
            competidorId: competidorId,
            etapaId: etapaId
          } 
      });

      return etapaCompetidor ? true : false;
    }
    static async existsPlacaEtapa(placa, etapaId) {
      let placaCompetidor = await EtapaCompetidor.findOne({ 
          where: { 
            placa: placa,
            etapaId: etapaId
          } 
        })

      return placaCompetidor ? true : false;
    }
    static async existsRfidEtapa(rfid, etapaId) {
      let rfidCompetidor = await EtapaCompetidor.findOne({ 
          where: { 
            rfid: rfid,
            etapaId: etapaId
          } 
      })

      return rfidCompetidor ? true : false;
    }
    static async validateData(etapaId, competidorId, placa, rfid) {
      if (await EtapaCompetidor.existsCompetidorEtapa(
        competidorId, 
        etapaId
      )) {
        throw new Error('Este competidor já foi cadastrado nesta etapa.');
      }

      if (await EtapaCompetidor.existsPlacaEtapa(
        placa, 
        etapaId
      )) {
        throw new Error('Esta placa já foi cadastrada nesta etapa.');
      }

      if (await EtapaCompetidor.existsRfidEtapa(
        rfid, 
        etapaId
      )) {
        throw new Error('Este RFID já foi cadastrado nesta etapa.');
      }
    };
    static associate(models) {
      EtapaCompetidor.belongsTo(models.Etapa, {foreignKey: 'etapaId', as: 'etapa', onDelete: 'cascade'}),
      EtapaCompetidor.belongsTo(models.Competidor, {foreignKey: 'competidorId', as: 'competidor', onDelete: 'cascade'}),
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
      type: DataTypes.DATE
    },
    dcf: {
      type: DataTypes.DATE
    },
    dct: {
      type: DataTypes.VIRTUAL,
      get() {
        if (!this.getDataValue('dci') || !this.getDataValue('dcf')) {
          return new Date(0);
        }
        
        const diff = Helper.getDateDiff( this.getDataValue('dcf'), this.getDataValue('dci') );
        return diff;
      }
    },
    pi: {
      type: DataTypes.DATE
    },
    pf: {
      type: DataTypes.DATE
    },
    pt: {
      type: DataTypes.VIRTUAL,
      get() {
        if (!this.getDataValue('pi') || !this.getDataValue('pf')) {
          return new Date(0);
        }
        
        const diff = Helper.getDateDiff( this.getDataValue('pf'), this.getDataValue('pi') );
        return diff;
      }
    }
  }, {
    hooks: {
      beforeCreate: async (etapaCompetidor, options) => {
        await EtapaCompetidor.validateData(
          etapaCompetidor.getDataValue('etapaId'),
          etapaCompetidor.getDataValue('competidorId'),
          etapaCompetidor.getDataValue('placa'),
          etapaCompetidor.getDataValue('rfid')
        );
      },
      beforeUpdate: async (etapaCompetidor, options) => {
        await EtapaCompetidor.validateData(
          etapaCompetidor.getDataValue('etapaId'),
          etapaCompetidor.getDataValue('competidorId'),
          etapaCompetidor.getDataValue('placa'),
          etapaCompetidor.getDataValue('rfid')
        );

        const etapa = await sequelize.models.Etapa.findByPk( etapaCompetidor.getDataValue('etapaId') );

        if ((etapaCompetidor.changed('categoriaId') ||
             etapaCompetidor.changed('placa') ||
             etapaCompetidor.changed('rfid')) &&
             (etapa.getDataValue('status') != '0')) {
    
            if (etapaCompetidor.changed('categoriaId')) {
              throw new Error('Você não pode alterar a categoria de um competidor após iniciar a competição.');
            }
    
            if (etapaCompetidor.changed('placa')) {
              throw new Error('Você não pode alterar a placa de um competidor após iniciar a competição.');
            }
    
            if (etapaCompetidor.changed('rfid')) {
              throw new Error('Você não pode alterar o RFID de um competidor após iniciar a competição.');
            }
        }

        if ((etapaCompetidor.changed('dci') ||
             etapaCompetidor.changed('dcf')) &&
             (etapa.getDataValue('status') != '1' &&
             etapa.getDataValue('status') != '2')) {
            
            throw new Error('Você não pode alterar o tempo inicial e final da descida classificatória sem antes realizar ela.');
        }

        if ((etapaCompetidor.changed('pi') ||
             etapaCompetidor.changed('pf')) &&
             (etapa.getDataValue('status') != '2')) {
            
            throw new Error('Você não pode alterar o tempo inicial e final da prova sem antes realizar ela.');
        }
        
        if (etapaCompetidor.getDataValue('dci') == 'Invalid Date' ||
            etapaCompetidor.getDataValue('dcf') == 'Invalid Date' ||
            etapaCompetidor.getDataValue('pi') == 'Invalid Date' ||
            etapaCompetidor.getDataValue('pf') == 'Invalid Date') {

            throw new Error('Você informou uma data inválida.');
        }
      }
    },
    sequelize,
    modelName: 'EtapaCompetidor',
    tableName: 'EtapaCompetidores'
  });
  return EtapaCompetidor;
};