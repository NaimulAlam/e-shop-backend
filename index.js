const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const app = express();
// const bodyParser = require("body-parser");
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v9g8ylp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const mongo = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("unauthorized access");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    const ProductCollection = mongo
      .db("eshopWsbDatabase")
      .collection("products");
    const userBasketCollection = mongo
      .db("eshopWsbDatabase")
      .collection("userBasket");
    const ReviewsCollection = mongo
      .db("eshopWsbDatabase")
      .collection("reviews");
    const AdminCollection = mongo.db("eshopWsbDatabase").collection("Admin");

    app.get("/products", async (req, res) => {
      const query = {};
      const items = await ProductCollection.find(query).toArray();
      res.send(items);
    });

    app.get("/reviews", async (req, res) => {
      const query = {};
      const reviews = await ReviewsCollection.find(query).toArray();
      res.send(reviews);
    });

    app.get("/allUserBasket", async (req, res) => {
      const query = {};
      const userBasket = await userBasketCollection.find(query).toArray();
      res.send(userBasket);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await productCollection.findOne(filter);
      res.send(result);
    });

    app.post("/addProducts", async (req, res) => {
      const newProduct = req.body;
      const result = await ProductCollection.insertOne(newProduct);
      res.send(result);
    });

    app.post("/addReview", async (req, res) => {
      const newReview = req.body;
      const result = ReviewsCollection.insertOne(newReview);
      res.send(result.insertedCount > 0);
    });

    app.post("/addAdmin", async (req, res) => {
      const newAdmin = req.body;
      const result = await AdminCollection.insertOne(newAdmin);
      res.send(result.insertedCount > 0);
    });

    app.post("/addToCart", async (req, res) => {
      const newCart = req.body;
      const result = await userBasketCollection.insertOne(newCart);
      res.send(result.insertedCount > 0);
    });

    app.get("/userBasket", async (req, res) => {
      const query = { email: req.query.email };
      const useBasket = await userBasketCollection.find(query).toArray();
      res.send(useBasket);
    });

    app.post("/isAdmin", async (req, res) => {
      const query = { email: req.query.email };
      const admin = AdminCollection.find(query).toArray();
      res.send(admin.length > 0);
    });

    app.delete("/deleteProduct/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const deletedProduct = ProductCollection.deleteOne(filter);
      res.send(deletedProduct);
    });

    app.patch("/updateProduct/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };

      const updatedProduct = await userBasketCollection.updateOne(filter);
      res.send(result.modifiedCount > 0);
    });
  } catch (err) {
    console.log(err.stack);
  }
}

run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("WellCome to EShopApi Database Server");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
