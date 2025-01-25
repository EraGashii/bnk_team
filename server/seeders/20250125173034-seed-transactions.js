'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Transactions', [
      {
        senderId: 1, // Filan Fisteki ID
        receiverId: 2, // Florim Florimi ID
        amount: 100.0,
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        senderId: 2, // Florim Florimi ID
        receiverId: 1, // Filan Fisteki ID
        amount: 50.0,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Transactions', null, {});
  },
};
