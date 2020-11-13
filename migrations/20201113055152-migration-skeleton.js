'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.addColumn('Matzips','userId',{type:Sequelize.INTEGER})
   await queryInterface.addColumn('Matzips','restId',{type:Sequelize.INTEGER})

    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('Matzips','userId',{type:Sequelize.INTEGER})
   await queryInterface.removeColumn('Matzips','restId',{type:Sequelize.INTEGER})
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
