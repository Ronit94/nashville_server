const sequelize = require('../../index'),
    Sequelize = require('sequelize');

module.exports = sequelize.define(
    "responses",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userid: {
            type: Sequelize.STRING(50).BINARY,
            allowNull: false
        },
        ad_id:{
            type:Sequelize.STRING(50).BINARY,
            allowNull : false
        },
        email:{
            type:Sequelize.STRING(50).BINARY,
            allowNull: false
        },
        mobile:{
            type: Sequelize.STRING(50).BINARY,
            allowNull:false,
        },
        message:{
           type: Sequelize.TEXT,
           allowNull:false 
        }
    },
    {
        tableName: "responses",
        timestamps: true,
        underscored: false
    }
);