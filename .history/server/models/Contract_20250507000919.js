module.exports = (sequelize, DataTypes) => {
    const Contract = sequelize.define("Contract", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        Title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    Title: {
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

    return Contract;
};
