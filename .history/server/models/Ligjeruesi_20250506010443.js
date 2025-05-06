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
        Department: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: "Ligjeruesis",
        timestamps: false
    });

    return Ligjeruesi;
};
