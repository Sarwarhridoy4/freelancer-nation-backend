const express = require('express');
const cors = require('cors');
// code for chat
const http = require("http");
const path = require("path");
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const portchat = process.env.PORT || 4000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0opjg0j.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
    try{
         // guidelineData
         const guidelineData = client.db('freelancerNation').collection('guidelineData');
         const serviceCategoty = client.db('freelancerNation').collection('serviceCategoty');
         const sellerCollection = client.db('freelancerNation').collection('sellerInfo');

         const usersCollection = client.db('freelancerNation').collection('users');




         // getting guidelineData
        app.get('/guidelineData', async(req, res) => {
            const query = {};
            const data = await guidelineData.find(query).toArray();
            res.send(data);
        });

        // gettung serviceCategoty
        app.get('/serviceCategoty', async(req, res) => {
            const query = {};
            const data = await serviceCategoty.find(query).toArray();
            res.send(data);
        })

        //Send seller to database
        app.post('/saveseller', async(req, res) => {
            const sellerInfo = req.body;
            const result = await sellerCollection.insertOne(sellerInfo);
            console.log(result);
            res.send(result);
        });

        // user(buyer and seller) data save------------
        app.put('/buyerData', async(req, res) => {
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


    }
    finally{

    }
}
run().catch(console.log)




app.get('/', async(req, res) =>{
    res.send('Freelancer Nation server is running');
})
//code for chat

// Serve the React frontend
app.use(express.static(path.join(__dirname, "client/build")));

// Start the server
const server = app.listen(portchat, () => {
  console.log(`Chat server up and running on port ${portchat}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "https://freelancernation.web.app",
  },
});

// Keep track of the messages that have already been sent
let sentMessages = [];

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log(`New client connected with: ${socket?.id}`);

  // Send the messages that have already been sent to the new client
  sentMessages.forEach((message) => {
    socket.emit("message", message);
  });

  socket.on("message", (message) => {
    // Check if the message has already been sent
    if (!sentMessages.includes(message)) {
      // If the message hasn't been sent, add it to the list of sent messages
      sentMessages.push(message);
      // Broadcast the message to all other clients
      socket.broadcast.emit("message", message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.listen(port, () => console.log(`Freelancer Nation server running on ${port}`))