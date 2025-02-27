// models/deposit.js
module.exports = (sequelize, DataTypes) => {
    const Deposit = sequelize.define('Deposit', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      method: {
        type: DataTypes.STRING,
        allowNull: false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending',
        allowNull: false
      }
    });
  
    // Add associations if needed
    Deposit.associate = function(models) {
      Deposit.belongsTo(models.User, { foreignKey: 'userId' });
    };
  
    return Deposit;
  };
  