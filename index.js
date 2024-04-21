
const express = require('express')
const app = express();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

app.get('/', (req, res) => {
  res.send('Coffe house is comming sonnn')
})


// CuBIZLN4C9xJ286Q

// const uri =`mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.iynsonj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri ="mongodb://localhost:27017";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("coffeeDB");
    const coffeeCollection = database.collection("coffee");


    const authCollection = client.db("authDB").collection("user");

   app.get('/user',async (req,res)=>{
  const cursor = authCollection.find();
  const result = await cursor.toArray();
  res.send(result);



 });

 app.patch('/user', async(req,res)=>{
  
   const user= req.body;
  const filter = {email: user.email};


  const updateUser = {
    $set: {
   
      lastLoggedAt :user.lastLoggedAt,

     
    }

  }
  const result = await authCollection.updateOne(filter, updateUser);
  res.send(result);


 })

app.delete('/user/:id', async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await authCollection.deleteOne(query);
  res.send(result);

})
  //  user post craete

  app.post('/user' ,async(req,res)=>{
  const user = req.body;
  console.log(user);
  const result = await authCollection.insertOne(user);
  res.send(result);
  
});




    app.get('/coffee',async(req,res)=>{
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);


    })

    app.get('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.findOne(query);
      res.send(result);


    });
    app.delete('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);


    });

app.put('/coffee/:id',async(req,res)=>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)};
  const options = { upsert: true };
  const updateCoffee = req.body;

  const coffee = {
    $set: {
    name: updateCoffee.name,
    quantity: updateCoffee.quantity,
    supplier: updateCoffee.supplier,
    taste: updateCoffee.taste,
    category: updateCoffee.category,
    details: updateCoffee.details,
    photo: updateCoffee.photo,

     
    }

  }

  const result = await coffeeCollection.updateOne(filter, coffee, options);
  res.send(result);

});

app.post('/coffee', async(req,res)=>{
  const newCoffee = req.body;
  console.log(newCoffee);
  const result = await coffeeCollection.insertOne(newCoffee);
res.send(result);
})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})