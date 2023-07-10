var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "user1",
    password: "pass",
    database: "somethingdb",
});
con.connect(function(err){
    if (err) throw err;
    console.log("Connected!");
});
