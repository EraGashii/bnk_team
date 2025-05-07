module.exports = (sequelize, DataTypes) => {
    const Satelite = sequelize.define("Satelite", {
         Id:{
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
