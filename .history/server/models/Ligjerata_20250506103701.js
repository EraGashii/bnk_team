module.exports = (sequelize, DataTypes) => {
    const Ligjerata = sequelize.define("Ligjerata", {
        Id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        LectureName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        LecturerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Ligjeruesi",
                key: "LecturerId",
            },
        },
    }, { timestamps: false });

    return Ligjerata;
};
