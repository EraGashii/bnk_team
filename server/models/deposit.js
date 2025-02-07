module.exports = (sequelize, DataTypes) => {
    const Deposit = sequelize.define("Deposit", {
      date: {
        type: DataTypes.DATE,
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
      status: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
  
    return Deposit;
  };
  