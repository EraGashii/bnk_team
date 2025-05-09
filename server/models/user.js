module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'email', // 👈 avoid creating new indexes on every sync
        msg: 'Email must be unique'
      }
    },    
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postalCode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("Pending", "Active", "Declined"),
      allowNull: false,
      defaultValue: "Pending",
    },
    role: {
      type: DataTypes.ENUM("User", "Admin"),
      allowNull: false,
      defaultValue: "User",
    }
  });

  User.associate = function(models) {
    User.hasMany(models.CreditCard, {
      foreignKey: 'userId',
      as: 'creditCards'
    });
  };

  return User;
};
