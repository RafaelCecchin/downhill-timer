'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Configuracoes', [
      {
        id: 1,
        portaCom: 'UNDEFINED',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Configuracoes', {id: {[Sequelize.Op.in]: [1]}}, {});
  }
};
