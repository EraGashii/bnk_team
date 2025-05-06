module.exports = (sequelize, DataTypes) => {
    const Ligjeruesi = sequelize.define("Ligjeruesi", {
        LecturerId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        LecturerName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        department: {   
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: "Ligjeruesi",
        timestamps: false
    });

    return Ligjeruesi;
};
