module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    'Transaction',
    {
      senderId: { type: DataTypes.INTEGER, allowNull: false },
      receiverId: { type: DataTypes.INTEGER, allowNull: false },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0.01 },
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending',
      },
    },
    { tableName: 'Transactions' }
  );

  Transaction.associate = function (models) {
    Transaction.belongsTo(models.User, { as: 'Sender', foreignKey: 'senderId' });
    Transaction.belongsTo(models.User, { as: 'Receiver', foreignKey: 'receiverId' });
  };

  return Transaction;
};
