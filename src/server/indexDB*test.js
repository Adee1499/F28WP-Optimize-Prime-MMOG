
// Importing packages
const express = require(“express”);
const bodyParser = require(“body-parser”);


const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

// Database Connection Info
const MongoClient = require(“mongodb”).MongoClient;

const url = “mongodb://localhost/leaderboard”;
let db;


app.get(“/”, function(req, res) {
   res.send(“Leaderboard”);
});


(async () => {
   let client = await MongoClient.connect(
       url,
       { useNewUrlParser: true }
   );

   db = client.db(“Players”);

   app.listen(PORT, async function() {
       console.log(`Listening on Port ${PORT}`);
       if (db) {
           console.log(“Database is Connected!”);
       }
   });
})();
