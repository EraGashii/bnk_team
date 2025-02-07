module.exports = (sequelize, DataTypes) => {
    const Transfer = sequelize.define("Transfer", {
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      fromAccount: {
        type: DataTypes.STRING,
        allowNull: false
      },
      toAccount: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
  
    return Transfer;
  };
  