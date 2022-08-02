'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Competidors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        allowNull: false,
        type: Sequelize.STRING
      },
      cpf: {
        allowNull: false,
        type: Sequelize.STRING(14),
        unique: true
      },
      nascimento: {        
        allowNull: false,
        type: Sequelize.DATE
      },
      patrocinador: {
        type: Sequelize.STRING
      },
      generoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Generos',
          key: 'id'
        }
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
    await queryInterface.dropTable('Competidors');
  }
};