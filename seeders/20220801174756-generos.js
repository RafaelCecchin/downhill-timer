'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Generos', [
      {
        id: 1,
        nome: 'Masculino',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        nome: 'Feminino',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Generos', {id: {[Op.in]: [1, 2]}}, {});
  }
};
