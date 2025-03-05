module.exports = (sequelize, DataTypes) => {
  const CreditCard = sequelize.define('CreditCard', {
    cardNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "unique_cardNumber",
        msg: "Card number must be unique"
      }
    },
    expirationDate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cvv: {
      type: DataTypes.STRING,
      allowNull: false
    },
    creditLimit: {
      type: DataTypes.FLOAT,
      defaultValue: 5000.00,
      allowNull: false
    },
    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
      allowNull: false,
      validate: {
        min: 0.0 // Balance cannot be negative
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'rejected'),
      defaultValue: 'pending'
    }
  });

  CreditCard.associate = function(models) {
    CreditCard.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    CreditCard.hasMany(models.Deposit, {
      foreignKey: 'creditCardId'
    });
  };

  return CreditCard;
};
