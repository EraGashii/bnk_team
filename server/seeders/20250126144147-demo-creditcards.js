'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('CreditCards', [
      {
        cardNumber: '4111111111111111',
        expirationDate: '12/28',
        cvv: '123',
        creditLimit: 5000,
        balance: 0,
        status: 'active',
        userId: 1, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cardNumber: '4222222222222222',
        expirationDate: '01/29',
        cvv: '456',
        creditLimit: 5000,
        balance: 0,
        status: 'active',
        userId: 2, 
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CreditCards', null, {});
  }
};
