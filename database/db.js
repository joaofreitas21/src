const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "nodejs",
    password: "root",
});

connection.connect();
module.exports = connection;