const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v9g8ylp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

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
  const ProductCollection = client.db("EShopApi Server").collection("products");
  const userBasketCollection = client
    .db("EShopApi Server")
    .collection("userBasket");
  const ReviewsCollection = client.db("EShopApi Server").collection("reviews");
  const AdminCollection = client.db("EShopApi Server").collection("Admin");

  app.get("/products", (req, res) => {
    ProductCollection.find({}).toArray((err, items) => {
      res.send(items);
      if (err) {
        res.send(err);
      }
    });
  });

  app.get("/reviews", (req, res) => {
    ReviewsCollection.find({}).toArray((err, items) => {
      res.send(items);
    });
  });

  app.get("/allUserBasket", (req, res) => {
    userBasketCollection.find({}).toArray((err, items) => {
      res.send(items);
    });
  });

  app.get("/products/:id", (req, res) => {
    ProductCollection.find({ _id: ObjectID(req.params.id) }).toArray(
      (err, documents) => {
        res.send(documents[0]);
      }
    );
  });

  app.post("/addProducts", (req, res) => {
    const newProduct = req.body;
    ProductCollection.insertOne(newProduct).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addReview", (req, res) => {
    const newReview = req.body;
    ReviewsCollection.insertOne(newReview).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addAdmin", (req, res) => {
    const newAdmin = req.body;
    AdminCollection.insertOne(newAdmin).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addToCart", (req, res) => {
    const newCart = req.body;
    userBasketCollection.insertOne(newCart).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/userBasket", (req, res) => {
    userBasketCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        if (err) {
          res.send(err);
        } else {
          res.send(documents);
        }
      });
  });

  app.post("/isAdmin", (req, res) => {
    AdminCollection.find({ email: req.body.email }).toArray((err, admin) => {
      res.send(admin.length > 0);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    ProductCollection.deleteOne({ _id: ObjectID(req.params.id) }).then(
      (result) => {
        res.send(result.deletedCount > 0);
      }
    );
  });

  app.patch("/updateBooking/:id", (req, res) => {
    userBasketCollection
      .updateOne(
        { _id: ObjectID(req.params.id) },
        {
          $set: { status: req.body.status },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
