"use strict";
module.exports = function (sequelize, DataTypes) {
    let Job = sequelize.define("job", {
        title: DataTypes.STRING,
        content: DataTypes.STRING
    },{
        tableName: 'job',
        createdAt: false,
        updatedAt: false
    });
    return Job;
};