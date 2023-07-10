var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "Mathen",
    password: "SackMathen_0",
    database: "eventdb",
});
con.connect(function(err){
    if (err) throw err;
    console.log("Connected!");
});
