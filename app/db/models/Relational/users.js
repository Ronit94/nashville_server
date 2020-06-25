const sequelize = require('../../index'),
    Sequelize = require('sequelize');

module.exports = sequelize.define(
    "users",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userid: {
            type: Sequelize.STRING(50).BINARY,
            primaryKey: true,
            allowNull: false
        },
        username:{
            type:Sequelize.STRING(50).BINARY,
            allowNull : false
        },
        Password:{
            type:Sequelize.TEXT,
            allowNull: false
        },
        isActive:{
            type: Sequelize.BOOLEAN,
            defaultValue : 1
        },
        resetPin:{
           type: Sequelize.INTEGER,
           allowNull:true 
        },
        last_login:{
            type: Sequelize.DATE,
            allowNull:false
        }
    },
    {
        tableName: "users",
        timestamps: true,
        underscored: false,
        indexes: [
            // Create a unique index on email
            {
              unique: true,
              fields: ['userid']
            }
        ]
    }
);