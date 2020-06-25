const sequelize = require('../../index'),
    Sequelize = require('sequelize');

module.exports = sequelize.define(
    "userProfiles",
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
        name: {
            type: Sequelize.STRING(50).BINARY,
            allowNull: false
        },
        address: {
            type: Sequelize.STRING(50).BINARY,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING(50).BINARY,
            allowNull: false
        },
        mobile: {
            type: Sequelize.STRING(13).BINARY,
            allowNull: false
        },
        city:{
            type: Sequelize.STRING(10).BINARY,
            allowNull : false
        }
    },
    {
        tableName: "userProfiles",
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