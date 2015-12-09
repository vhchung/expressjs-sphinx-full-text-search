"use strict";
module.exports = function (sequelize, DataTypes) {
    let Book = sequelize.define("book", {
        title: DataTypes.STRING,
        content: DataTypes.STRING,
        author: DataTypes.STRING
    },{
        tableName: 'book',
        createdAt: false,
        updatedAt: false
    });
    return Book;
};