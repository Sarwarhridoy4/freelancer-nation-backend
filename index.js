const express = require('express');
const cors = require('cors');
// code for chat
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0opjg0j.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
  try {
    // guidelineData
    const guidelineData = client.db('freelancerNation').collection('guidelineData');
    const serviceCategoty = client.db('freelancerNation').collection('serviceCategoty');
    const sellerCollection = client.db('freelancerNation').collection('sellerInfo');

    const usersCollection = client.db('freelancerNation').collection('users');




    //-----------------------------------------------------------

    // user(buyer and seller) data save------------
    app.put('/users', async (req, res) => {
      const user = req.body
      const email = user.email
      const filter = { email: email }
      const options = { upsert: true }
      const updateDoc = {
        $set: user,
      }
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })




    // get admin user-----
    app.get('/users/admin/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === 'admin' });
    });

    //admin show all buyers info
    app.get('/allBuyers', async (req, res) => {
      const query = {}
      const users = await usersCollection.find(query).toArray();
      const buyers = users.filter(buyer => buyer.sellerAccount === false)
      const result = buyers.filter(admin => admin.role !== 'admin');
      res.send(result)
    });

    //admin show all sellers info
    app.get('/allSellers', async (req, res) => {
      const query = {}
      const users = await usersCollection.find(query).toArray();
      const sellers = users.filter(buyer => buyer.sellerAccount === true)
      const result = sellers.filter(admin => admin.role !== 'admin');
      res.send(result)
    });

    // admin delete any buyer or sellers-----------
    app.delete('/users/delete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });


    //------------------------------------------------------------
     // get user for seller--------
     app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query)
      res.send({ isSeller: user?.sellerAccount === true });
  });

     // get user for buyers--------
     app.get('/users/buyer/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isBuyer: user?.sellerAccount === false });
  });



    //-------------------------------------------------------

    // getting guidelineData
    app.get('/guidelineData', async (req, res) => {
      const query = {};
      const data = await guidelineData.find(query).toArray();
      res.send(data);
    });

    // getting serviceCategoty
    app.get('/serviceCategoty', async (req, res) => {
      const query = {};
      const data = await serviceCategoty.find(query).toArray();
      res.send(data);
    })

    //Send seller to database
    app.post('/saveseller', async (req, res) => {
      const sellerInfo = req.body;
      const result = await sellerCollection.insertOne(sellerInfo);
      console.log(result);
      res.send(result);
    });




  }
  finally {

  }
}
run().catch(console.log)




app.get('/', async (req, res) => {
  res.send('Freelancer Nation server is running');
})


app.listen(port, () => console.log(`Freelancer Nation server running on ${port}`))