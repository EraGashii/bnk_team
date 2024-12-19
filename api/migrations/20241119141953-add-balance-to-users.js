'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the `balance` column to the `Users` table
    await queryInterface.addColumn('User', 'balance', {
      type: Sequelize.FLOAT, // Use FLOAT for monetary values
      allowNull: false,      // Ensure every user has a balance
      defaultValue: 0.0,     // Set the default balance to 0
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the `balance` column from the `Users` table
    await queryInterface.removeColumn('User', 'balance');
  },
};
