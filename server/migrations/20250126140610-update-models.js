'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Remove the `balance` column from the `Users` table
    await queryInterface.removeColumn('Users', 'balance');

    // Step 2: Add new columns to the `Users` table
    await queryInterface.addColumn('Users', 'address', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('Users', 'postalCode', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
    await queryInterface.addColumn('Users', 'phoneNumber', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    // Step 3: Add the `balance` column to the `CreditCards` table
    await queryInterface.addColumn('CreditCards', 'balance', {
      type: Sequelize.FLOAT,
      defaultValue: 0.0,
      allowNull: false,
      validate: {
        min: 0.0
      }
    });

    // Step 4: Update the `Transactions` table
    await queryInterface.removeColumn('Transactions', 'senderId');
    await queryInterface.removeColumn('Transactions', 'receiverId');
    await queryInterface.addColumn('Transactions', 'senderCardId', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
    await queryInterface.addColumn('Transactions', 'receiverCardId', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes if needed
    await queryInterface.addColumn('Users', 'balance', {
      type: Sequelize.FLOAT,
      defaultValue: 0.0,
      allowNull: false
    });

    await queryInterface.removeColumn('Users', 'address');
    await queryInterface.removeColumn('Users', 'postalCode');
    await queryInterface.removeColumn('Users', 'phoneNumber');

    await queryInterface.removeColumn('CreditCards', 'balance');

    await queryInterface.removeColumn('Transactions', 'senderCardId');
    await queryInterface.removeColumn('Transactions', 'receiverCardId');
    await queryInterface.addColumn('Transactions', 'senderId', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
    await queryInterface.addColumn('Transactions', 'receiverId', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};
