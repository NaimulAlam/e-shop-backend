const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dspyj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("WellCome to EShopApi Server");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const ServiceCollection = client.db("EShopApi Server").collection("services");

  app.get("/services", (req, res) => {
    ServiceCollection.find({}).toArray((err, items) => {
      res.send(items);
    });
  });

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
