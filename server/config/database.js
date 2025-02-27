const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bnk_database', 'root', 'Gashi2004', {
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
});

sequelize.authenticate()
    .then(() => console.log("✅ Database connected successfully!"))
    .catch(err => console.error("❌ Database connection failed:", err));

module.exports = sequelize;
