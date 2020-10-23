var http = require("http");

const mysql = require("mysql");

// Create connection to the database
// Port 3306
const connection = mysql.createConnection({
  // Very secure having the login here!
  host: "sql2.freesqldatabase.com",       //our database info
  user: "sql2371952",
  password: "cF3*rV3*",
  database: "sql2371952"
});

let out = "";

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected Database!");
  //create a server object:

  connection.query("drop table calc;", function (err, result) {
    console.log(result);
    // fail if table is already created
    out += "drop table:" + err + "\n";
  });

  connection.query("create table calc(x int, y int);", function (err, result) {
    console.log(result);
    // fail if table is already created
    out += "create table:" + err + "\n";
  });

  connection.query("insert into calc values(10, 25);", function (err, result) {
    console.log(result);
    out += "insert into calc:" + result + "\n";
  });

  connection.query("select x,y, (x+y) from calc;", function (err, result) {
    console.log(result);
    out += "select x,y: " + result[0].x + "\n";

    http
      .createServer(function (req, res) {
        res.write("Hello2:" + out);
        res.end(); //end the response
      })
      .listen(8080);
  });
});
