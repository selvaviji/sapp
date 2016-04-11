var mysql = require('mysql');

var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'selva75gee',
    database : 'gautham'
});

exports.pool = pool;