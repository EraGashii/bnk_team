    module.exports = (sequelize, DataTypes) => {
        const Ligjeruesi = sequelize.define("Ligjeruesi", {
            LecturerId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            LecturerName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        Departament: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        }, {
            timestamps: false
        });

        return  Ligjeruesi;
    };
