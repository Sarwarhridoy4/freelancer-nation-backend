const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0opjg0j.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri);


async function run(){
    try{
         // guidelineData
         const guidelineData = client.db('freelancerNation').collection('guidelineData');
         const serviceCategoty = client.db('freelancerNation').collection('serviceCategoty');




         // gettung guidelineData
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


    }
    finally{

    }
}
run().catch(console.log)




app.get('/', async(req, res) =>{
    res.send('Freelancer Nation server is running');
})
app.listen(port, () => console.log(`Freelancer Nation server running on ${port}`))