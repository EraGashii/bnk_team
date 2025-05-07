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
        TeamId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Teams",
                key: "TeamId",
            },
        },
    }, { timestamps: false });

    return Player;
};
