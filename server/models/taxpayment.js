module.exports = (sequelize, DataTypes) => {
  const TaxPayment = sequelize.define("TaxPayment", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    creditCardNumber: {
      type: DataTypes.STRING, // Allows manual entry if needed
      allowNull: true,
    },
    taxName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "paid"),
      defaultValue: "pending",
    },
  });

  TaxPayment.associate = (models) => {
    TaxPayment.belongsTo(models.User, { foreignKey: "userId" });
  };

  return TaxPayment;
};
