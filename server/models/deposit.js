module.exports = (sequelize, DataTypes) => {
    const Deposit = sequelize.define('Deposit', {
      creditCardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'CreditCards',
          key: 'id',
        },
        onDelete: 'CASCADE', // Ensures when the card is deleted, deposits will be removed as well
        onUpdate: 'CASCADE',
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      method: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending',
        allowNull: false,
      },
    });
  
    Deposit.associate = function(models) {
      Deposit.belongsTo(models.CreditCard, { foreignKey: 'creditCardId' });
    };
  
    return Deposit;
  };
  