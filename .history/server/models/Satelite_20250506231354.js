module.exports = (sequelize, DataTypes) => {
    const Player = sequelize.define("Player", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
          },
        PlanetId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Planets",
                key: "PlanetId",
            },
        },
    }, { timestamps: false });

    return Player;
};
