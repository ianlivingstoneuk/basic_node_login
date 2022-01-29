const mysql = require('mysql');
require('dotenv').config();

/*Mysql Connection*/

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    multipleStatements: true
});

module.exports = connection;