'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Etapas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      campeonatoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Campeonatos',
          key: 'id'
        }
      },
      numero: {
        allowNull: false,
        type: Sequelize.INTEGER        
      },
      data: {
        allowNull: false,
        type: Sequelize.DATE
      },
      status: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0    
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

    await queryInterface.addConstraint('Etapas', {
      type: 'unique',
      name: 'unique_numero_campeonato',
      fields: ['numero', 'campeonatoId']
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Etapas');
  }
};