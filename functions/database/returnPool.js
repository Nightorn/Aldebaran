const config = require(`${process.cwd()}/config.json`);
const mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 13,
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
module.exports = pool;