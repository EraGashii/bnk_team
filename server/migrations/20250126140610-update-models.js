'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Remove the `balance` column from the `Users` table if it exists
    const [usersBalanceColumn] = await queryInterface.sequelize.query(`
      SHOW COLUMNS FROM Users LIKE 'balance';
    `);
    if (usersBalanceColumn.length > 0) {
      await queryInterface.removeColumn('Users', 'balance');
    }

    // Step 2: Add new columns to the `Users` table if they don't exist
    const [addressColumn] = await queryInterface.sequelize.query(`
      SHOW COLUMNS FROM Users LIKE 'address';
    `);
    if (addressColumn.length === 0) {
      await queryInterface.addColumn('Users', 'address', {
        type: Sequelize.STRING,
        allowNull: false,
      });
    }

    const [postalCodeColumn] = await queryInterface.sequelize.query(`
      SHOW COLUMNS FROM Users LIKE 'postalCode';
    `);
    if (postalCodeColumn.length === 0) {
      await queryInterface.addColumn('Users', 'postalCode', {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    }

    const [phoneNumberColumn] = await queryInterface.sequelize.query(`
      SHOW COLUMNS FROM Users LIKE 'phoneNumber';
    `);
    if (phoneNumberColumn.length === 0) {
      await queryInterface.addColumn('Users', 'phoneNumber', {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    }

    // Step 3: Add the `balance` column to the `CreditCards` table if it doesn't exist
    const [creditCardBalanceColumn] = await queryInterface.sequelize.query(`
      SHOW COLUMNS FROM CreditCards LIKE 'balance';
    `);
    if (creditCardBalanceColumn.length === 0) {
      await queryInterface.addColumn('CreditCards', 'balance', {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
        allowNull: false,
        validate: {
          min: 0.0,
        },
      });
    }

    // Step 4: Update the `Transactions` table if columns exist or don't exist
    const [transactionsSenderColumn] = await queryInterface.sequelize.query(`
      SHOW COLUMNS FROM Transactions LIKE 'senderId';
    `);
    if (transactionsSenderColumn.length > 0) {
      await queryInterface.removeColumn('Transactions', 'senderId');
    }

    const [transactionsReceiverColumn] = await queryInterface.sequelize.query(`
      SHOW COLUMNS FROM Transactions LIKE 'receiverId';
    `);
    if (transactionsReceiverColumn.length > 0) {
      await queryInterface.removeColumn('Transactions', 'receiverId');
    }

    const [senderCardColumn] = await queryInterface.sequelize.query(`
      SHOW COLUMNS FROM Transactions LIKE 'senderCardId';
    `);
    if (senderCardColumn.length === 0) {
      await queryInterface.addColumn('Transactions', 'senderCardId', {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    }

    const [receiverCardColumn] = await queryInterface.sequelize.query(`
      SHOW COLUMNS FROM Transactions LIKE 'receiverCardId';
    `);
    if (receiverCardColumn.length === 0) {
      await queryInterface.addColumn('Transactions', 'receiverCardId', {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Revert changes

    const [usersBalanceColumn] = await queryInterface.sequelize.query(`
      SHOW COLUMNS FROM Users LIKE 'balance';
    `);
    if (usersBalanceColumn.length === 0) {
      await queryInterface.addColumn('Users', 'balance', {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
        allowNull: false,
      });
    }

    const [addressColumn] = await queryInterface.sequelize.query(`
      SHOW COLUMNS FROM Users LIKE 'address';
    `);
    if (addressColumn.length > 0) {
      await queryInterface.removeColumn('Users', 'address');
    }

    const [postalCodeColumn] = await queryInterface.sequelize.query(`
      SHOW COLUMNS FROM Users LIKE 'postalCode';
    `);
    if (postalCodeColumn.length > 0) {
      await queryInterface.removeColumn('Users', 'postalCode');
    }

    const [phoneNumberColumn] = await queryInterface.sequelize.query(`
      SHOW COLUMNS FROM Users LIKE 'phoneNumber';
    `);
    if (phoneNumberColumn.length > 0) {
      await queryInterface.removeColumn('Users', 'phoneNumber');
    }

    const [creditCardBalanceColumn] = await queryInterface.sequelize.query(`
      SHOW COLUMNS FROM CreditCards LIKE 'balance';
    `);
    if (creditCardBalanceColumn.length > 0) {
      await queryInterface.removeColumn('CreditCards', 'balance');
    }

    const [senderCardColumn] = await queryInterface.sequelize.query(`
      SHOW COLUMNS FROM Transactions LIKE 'senderCardId';
    `);
    if (senderCardColumn.length > 0) {
      await queryInterface.removeColumn('Transactions', 'senderCardId');
    }

    const [receiverCardColumn] = await queryInterface.sequelize.query(`
      SHOW COLUMNS FROM Transactions LIKE 'receiverCardId';
    `);
    if (receiverCardColumn.length > 0) {
      await queryInterface.removeColumn('Transactions', 'receiverCardId');
    }

    await queryInterface.addColumn('Transactions', 'senderId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.addColumn('Transactions', 'receiverId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};

