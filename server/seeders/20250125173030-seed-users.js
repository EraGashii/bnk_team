'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Filan',
        surname: 'Fisteki',
        email: 'filan@gmail.com',
        password: 'filan123', 
        balance: 1000.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Florim',
        surname: 'Florimi',
        email: 'florim@gmail.com',
        password: 'florim123',
        balance: 500.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
