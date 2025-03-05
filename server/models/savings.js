module.exports = (sequelize, DataTypes) => {
  const Savings = sequelize.define("Savings", {
    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
      allowNull: false,
    },
  });

  Savings.associate = function (models) {
    Savings.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return Savings;
};
