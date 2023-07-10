const mysql = require('mysql');

//DBC = DATABASE CONNECTION
var dbc = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "SackMathen_0",
    database: "eventdb"
});

dbc.connect((err) => {
    if (err) {
        console.log("Database Connection Failed: ", err);
    }
    else {
        console.log("Database Connected!");
    }
});

module.exports = dbc;