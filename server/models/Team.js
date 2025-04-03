module.exports = (sequelize, DataTypes) => {
    const Team = sequelize.define("Team", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: false
    });

    return Team;
};
