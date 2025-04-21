module.exports = (sequelize, DataTypes) => {
    const Team = sequelize.define("Team", {
        TeamId: {
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
