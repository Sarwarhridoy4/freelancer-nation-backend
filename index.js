const express = require("express");
const cors = require("cors");
// code for chat
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0opjg0j.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    // guidelineData
    const guidelineData = client
      .db("freelancerNation")
      .collection("guidelineData");
    const serviceCategoty = client
      .db("freelancerNation")
      .collection("serviceCategoty");
    const sellerCollection = client
      .db("freelancerNation")
      .collection("sellerInfo");

    const sellerGigCollection = client
      .db("freelancerNation")
      .collection("sellerGig");

    const orderGigCollection = client
      .db("freelancerNation")
      .collection("orderGig");

    const usersCollection = client.db("freelancerNation").collection("users");

    //-----------------------------------------------------------

    // user(buyer and seller) data save------------
    app.put("/users", async (req, res) => {
      const user = req.body;
      const email = user.email;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // get admin user-----
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });

    //admin show all buyers info
    app.get("/allBuyers", async (req, res) => {
      const query = {};
      const users = await usersCollection.find(query).toArray();
      const buyers = users.filter((buyer) => buyer.sellerAccount === false);
      const result = buyers.filter((admin) => admin.role !== "admin");
      res.send(result);
    });

    //admin show all sellers info
    app.get("/allSellers", async (req, res) => {
      const query = {};
      const users = await usersCollection.find(query).toArray();
      const sellers = users.filter((buyer) => buyer.sellerAccount === true);
      const result = sellers.filter((admin) => admin.role !== "admin");
      res.send(result);
    });

    // admin delete any buyer or sellers-----------
    app.delete("/users/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    //------------------------------------------------------------
    // get user for seller--------
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isSeller: user?.sellerAccount === true });
    });

    // get user for buyers--------
    app.get("/users/buyer/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isBuyer: user?.sellerAccount === false });
    });

    //-------------------------------------------------------

    // getting guidelineData
    app.get("/guidelineData", async (req, res) => {
      const query = {};
      const data = await guidelineData.find(query).toArray();
      res.send(data);
    });

    // getting guidelineData
    app.get("/sellerGigAll", async (req, res) => {
      const query = {};
      const data = await sellerGigCollection.find(query).toArray();
      res.send(data);
    });

    // getting sellerGigShort
    app.get("/sellerGigShort", async (req, res) => {
      const query = {};
      const data = await sellerGigCollection.find(query).limit(6).toArray();
      res.send(data);
    });

    // folling api are for hoem page section Explore the Marketplace
    app.get("/graphic-design", async (req, res) => {
      const query = { title: "Graphic Design" };
      const data = await sellerGigCollection.find(query).toArray();
      res.send(data);
    });

    app.get("/digitalMarketing", async (req, res) => {
      const query = { title: "Digital Marketing" };
      const data = await sellerGigCollection.find(query).toArray();
      res.send(data);
    });
    // getting data cooy write or content writhg
    app.get("/writing-tranlation", async (req, res) => {
      const query = {
        $or: [{ title: "copywriting" }, { title: "Content Writing" }],
      };
      const data = await sellerGigCollection.find(query).toArray();
      res.send(data);
    });

    app.get("/video-animation", async (req, res) => {
      const query = {
        $or: [
          { title: "Logo Animation" },
          { title: "Video Editing " },
          { title: "Video Editing" },
        ],
      };
      const data = await sellerGigCollection.find(query).toArray();
      res.send(data);
    });

    app.get("/digitalMarketing", async (req, res) => {
      const query = { title: "Digital Marketing" };
      const data = await sellerGigCollection.find(query).toArray();
      res.send(data);
    });

    app.get("/music-audio", async (req, res) => {
      const query = { title: "Music & Audio" };
      const data = await sellerGigCollection.find(query).toArray();
      res.send(data);
    });

    app.get("/programming-tech", async (req, res) => {
      const query = {
        $or: [
          { title: "Web Deve" },
          { title: "Video Editing " },
          { title: "Video Editing" },
          { title: "Graphic Design" },
          { title: "Digital Marketing" },
          { title: "Content Writing" },
          { title: "copywriting" },
          { title: "Logo Animation" },
          { title: "Social Media" },
          { title: "Website Development" },
        ],
      };
      const data = await sellerGigCollection.find(query).toArray();
      res.send(data);
    });

    app.get("/business", async (req, res) => {
      const query = { title: "Business" };
      const data = await sellerGigCollection.find(query).toArray();
      res.send(data);
    });

    app.get("/lifestyle", async (req, res) => {
      const query = { title: "LifeStyle" };
      const data = await sellerGigCollection.find(query).toArray();
      res.send(data);
    });

    app.get("/dataScience", async (req, res) => {
      const query = { title: "Data Science" };
      const data = await sellerGigCollection.find(query).toArray();
      res.send(data);
    });

    app.get("/photography", async (req, res) => {
      const query = { title: "Photography" };
      const data = await sellerGigCollection.find(query).toArray();
      res.send(data);
    });

    // getting serviceCategoty
    app.get("/serviceCategoty", async (req, res) => {
      const query = {};
      const data = await serviceCategoty.find(query).toArray();
      res.send(data);
    });

    //Send seller to database
    app.post("/saveseller", async (req, res) => {
      const sellerInfo = req.body;
      const result = await sellerCollection.insertOne(sellerInfo);
      res.send(result);
    });

    //Send seller gig to database
    app.post("/seller/gig", async (req, res) => {
      const sellerInfo = req.body;
      const result = await sellerGigCollection.insertOne(sellerInfo);
      res.send(result);
    });

    //get seller gig from database
    app.get("/seller/gig/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await sellerGigCollection.find(query).toArray();
      res.send(result);
    });

    // admin delete any buyer or sellers-----------
    app.delete("/gig/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await sellerGigCollection.deleteOne(query);
      res.send(result);
    });

    // order gig post to database
    app.post("/order/gig", async (req, res) => {
      const orderGigInfo = req.body;
      const result = await orderGigCollection.insertOne(orderGigInfo);
      res.send(result);
    });

    // order gig post to database
    app.get("/buyer/gigOrders/:email", async (req, res) => {
      const buyerEmail = req.params.email;
      const query = { buyerEmail: buyerEmail };
      const result = await orderGigCollection.find(query).toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("Freelancer Nation server is running");
});

app.listen(port, () =>
  console.log(`Freelancer Nation server running on ${port}`)
);
