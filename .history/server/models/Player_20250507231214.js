module.exports = (sequelize, DataTypes) => {
    const Player = sequelize.define("Player", {
         Id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
       Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
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
