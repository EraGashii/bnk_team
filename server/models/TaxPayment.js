'use strict';

module.exports = (sequelize, DataTypes) => {
  const TaxPayment = sequelize.define('TaxPayment', {
    taxpayerName: DataTypes.STRING,
    taxId: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    date: DataTypes.DATE
  });

  return TaxPayment;
};
