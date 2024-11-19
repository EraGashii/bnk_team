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
      unique: true,
      allowNull: false,

    },


    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0, // Initial balance is zero
      allowNull: false,
      validate: {
        min: 0.0, // Balance cannot be negative
      },

    }

  });

  return User;
}
