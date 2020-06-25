const sequelize = require('../../index'),
    Sequelize = require('sequelize');

module.exports = sequelize.define(
    "categories",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        categoryid: {
            type: Sequelize.STRING(50).BINARY,
            primaryKey: true,
            allowNull: false
        },
        name:{
            type:Sequelize.STRING(50).BINARY,
            allowNull : false
        },
        isActive:{
            type:Sequelize.BOOLEAN,
            defaultValue : 1
        }
    },
    {
        tableName: "categories",
        timestamps: true,
        underscored: false
    }
);