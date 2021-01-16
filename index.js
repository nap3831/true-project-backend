const express = require("express");
const app = express();
let cors = require("cors");
const bodyParser = require("body-parser");
let MongoClient = require("mongodb").MongoClient;
let url =
  "mongodb+srv://admin:123456789a@cluster0.zt15y.mongodb.net/test?retryWrites=true&w=majority";
let port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // parse form data client
app.use(cors());

app.get('/',()=>{
  res.send({
    "welcome": "Hello Welcome"
  })
})
// Created
app.post("/users", async (req, res) => {
  let data = "";
  const { first_name, last_name, telephone } = req.body;
  await MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    /*Return only the documents with the address "Park Lane 38":*/
    var query = {
      telephone: telephone,
    };
    dbo
      .collection("users")
      .find(query)
      .toArray(function (err, result) {
        if (err) {
          throw err;
        }
        console.log("found data : ", result);
        db.close();
        if (result.length > 0) {
          res.status(400).send({ msg: "Telephone number is active in system" });
        } else {
          MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            var myobj = {
              first_name: first_name,
              last_name: last_name,
              telephone: telephone,
            };
            dbo.collection("users").insertOne(myobj, function (err, res) {
              if (err) throw err;
              console.log("1 document inserted");
              db.close();
            });
          });

          res.status(201).send();
        }
      });
  });
});

app.listen(port, () => {
  console.log(`Application is running on ${port}`);
});
