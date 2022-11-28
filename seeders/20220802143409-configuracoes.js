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
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Configuracoes', {id: {[Op.in]: [1]}}, {});
  }
};
