const sequelize = require('../../index'),
    Sequelize = require('sequelize');

module.exports = sequelize.define(
    "adverts",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ad_id: {
            type: Sequelize.STRING(50).BINARY,
            primaryKey: true,
            allowNull: false
        },
        title:{
            type:Sequelize.TEXT,
            allowNull : false
        },
        categoryid:{
            type:Sequelize.STRING(50).BINARY,
            allowNull : false
        },
        description:{
            type:Sequelize.TEXT,
            allowNull : false
        },
        views:{
            type:Sequelize.INTEGER,
            defaultValue : 0
        },
        userid:{
            type:Sequelize.STRING(50).BINARY,
            allowNull : false
        },
        type:{
            type:Sequelize.STRING(50).BINARY,
            allowNull : false
        },
        engages:{
            type:Sequelize.BOOLEAN,
            defaultValue : 0
        }
    },
    {
        tableName: "adverts",
        timestamps: true,
        underscored: false,
        indexes: [
            // Create a unique index on email
            {
              unique: true,
              fields: ['categoryid']
            }
        ]
    }
);