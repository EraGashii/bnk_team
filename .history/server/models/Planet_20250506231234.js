module.exports = (sequelize, DataTypes) => {
    const Team = sequelize.define("Team", {
        PlanetId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: "Teams",
        timestamps: false
    });

    return Team;
};
