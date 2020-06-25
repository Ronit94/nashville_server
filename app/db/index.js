require('dotenv').config();

const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql', //| 'sqlite' | 'postgres' | 'mssql',
    operatorsAliases: '0',
    logging: true,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});


sequelize
    .authenticate()
    .then(() => {
        console.log('Database Connection has been established successfully.');
    })
    .catch(err => {
        console.error(`Unable to connect to the database ${err}`);
    });


module.exports = sequelize