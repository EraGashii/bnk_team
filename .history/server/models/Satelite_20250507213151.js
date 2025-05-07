module.exports = (sequelize, DataTypes) => {
    const Satelite = sequelize.define("Satelite", {
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
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
          },
        PlanetId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Planet",
                key: "PlanetId",
            },
        },
    }, { timestamps: false });

    return Satelite;
};
