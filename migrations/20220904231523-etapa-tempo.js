'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Etapas', 'dci', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn('Etapas', 'dcf', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn('Etapas', 'pi', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn('Etapas', 'pf', {
        type: Sequelize.DATE,
        allowNull: true,
      })
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Etapas', 'dci'),
      queryInterface.removeColumn('Etapas', 'dcf'),
      queryInterface.removeColumn('Etapas', 'pi'),
      queryInterface.removeColumn('Etapas', 'pf')
    ]);
  }
};
