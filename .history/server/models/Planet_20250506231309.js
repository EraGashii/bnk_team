module.exports = (sequelize, DataTypes) => {
    const Planet = sequelize.define("Planet", {
        PlanetId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: "Planets",
        timestamps: false
    });

    return Planet;
};
