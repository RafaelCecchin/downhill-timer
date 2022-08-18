'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EtapaCompetidores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      etapaId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Etapas',
          key: 'id'
        }
      },
      competidorId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Competidores',
          key: 'id'
        }
      },
      categoriaId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Categorias',
          key: 'id'
        }
      },
      placa: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      rfid: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      dci: {
        type: Sequelize.DATE
      },
      dcf: {
        type: Sequelize.DATE
      },
      pi: {
        type: Sequelize.DATE
      },
      pf: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('EtapaCompetidores');
  }
};