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
    {
      timestamps: true, // ✅ This ensures createdAt and updatedAt are added automatically
    }
  );

  return Transaction;
};
