module.exports = (sequelize, DataTypes) => {
    const Contract = sequelize.define("Contract", {
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
        Number: {
            type: DataTypes.INTEGER,
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

    return Contract;
};
