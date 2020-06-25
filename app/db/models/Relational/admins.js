const sequelize = require('../../index'),
    Sequelize = require('sequelize');

module.exports = sequelize.define(
    "admins",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        adminid: {
            type: Sequelize.STRING(50).BINARY,
            primaryKey: true,
            allowNull: false
        },
        name:{
            type:Sequelize.STRING(50).BINARY,
            allowNull: false
        },
        loggedin:{
            type: Sequelize.BOOLEAN,
            allowNull:false,
            defaultValue : 0
        },
        email:{
            type: Sequelize.STRING(50).BINARY,
            allowNull: false
        },
        Password: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        mobile:{
           type: Sequelize.STRING(50).BINARY,
           allowNull: false 
        },
        resetPin:{
           type: Sequelize.INTEGER,
           allowNull:true 
        }
    },
    {
        tableName: "admins",
        timestamps: true,
        underscored: false
    }
);