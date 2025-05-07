module.exports = (sequelize, DataTypes) => {
    const Satelite = sequelize.define("Satelite", {
         Id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
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

    return Satelite;
};
