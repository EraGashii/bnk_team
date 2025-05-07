module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define("Employee", {
        EmployeeId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
          }
          
    }, {
        tableName: "Employees",
        timestamps: false
    });

    return Employee;
};
