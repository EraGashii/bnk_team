const { DESCRIBE } = require("sequelize/lib/query-types");

module.exports = (sequelize, DataTypes) => {
    const Contract = sequelize.define("Contract", {
        Id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
       Title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: false
          },          
          EmployeeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Employees",
                key: "EmployeeId",
            },
        },
    }, { timestamps: false });

    return Contract;
};
