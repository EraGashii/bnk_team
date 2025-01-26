'use strict';

const bcrypt = require('bcrypt'); 

module.exports = {
  async up(queryInterface, Sequelize) {
    const johnPassword = await bcrypt.hash('john123', 10); 
    const janePassword = await bcrypt.hash('jane123', 10);

    await queryInterface.bulkInsert('Users', [
      {
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        password: johnPassword, 
        address: '123 Main St',
        postalCode: 12345,
        phoneNumber: 123456789,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Jane',
        surname: 'Doe',
        email: 'jane.doe@example.com',
        password: janePassword,
        address: '456 Elm St',
        postalCode: 67890,
        phoneNumber: 987654321,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
