module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    'Transaction',
    {
      senderCardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receiverCardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 5.00, // Minimum transaction amount
        },
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending',
      },
    },
    {}
  );

  Transaction.associate = function (models) {
    Transaction.belongsTo(models.CreditCard, { as: 'SenderCard', foreignKey: 'senderCardId' });
    Transaction.belongsTo(models.CreditCard, { as: 'ReceiverCard', foreignKey: 'receiverCardId' });
  };

  return Transaction;
};
