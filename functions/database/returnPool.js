const config = require(`${process.cwd()}/config.json`);
const mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 13,
    host: (process.argv[2] === "dev" ? config.mysql.host : "localhost"),
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
module.exports = pool;