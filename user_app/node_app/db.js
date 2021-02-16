const mysql = require("mysql");


const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password:'Rootpassword1!',
    database: 'ispit'
});


module.exports = pool;
