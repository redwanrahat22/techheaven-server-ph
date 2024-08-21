const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

app.get('/',async(req,res)=>{
  res.send('server is running')
})

app.listen(port,()=>{
    console.log(`listening to port ${port}`)
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@heaven1.sxh69xa.mongodb.net/?retryWrites=true&w=majority&appName=heaven1`;

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  async function run()
 {

    try {
      await client.connect();

   
            const techDatabase = client.db("All-Products")
            
    
        app.post('/productDB',async(req,res)=>{
            productData = req.body
            nameDB = productData.brand
          
            const submit = await techDatabase.collection(nameDB).insertOne(productData)
            res.send(submit)
        })

        app.post('/users',async(req,res)=>{
            const userData = req.body
        
            const result = await techDatabase.collection('UserData').insertOne(userData)
            res.send(result)
        })

        app.get('/users/:useremail',async(req,res)=>{
          const Useremail = req.params.useremail.replace(/['"]+/g, '')
         
          const query = {email: Useremail}
         
          const result = await techDatabase.collection('UserData').findOne(query)
          
          res.send(result)
        })
        
        app.get('/showproducts/:brand',async(req,res)=>{
          const brand = req.params.brand
         
         
          const cursor = techDatabase.collection(`${brand}`).find()
          const result = await cursor.toArray()
  
          res.send(result)
        })

        app.get('/details/:brand/:id',async(req,res)=>{
          const id = req.params.id
          const brand = req.params.brand
       
          const query = {_id : new ObjectId(id)}
          const result = await techDatabase.collection(`${brand}`).findOne(query)
         
          res.send(result)
          
        })

       

        app.put('/productDB',async(req,res)=>{
          const UpdateData = req.body
            const id = UpdateData._id
            const brand = UpdateData.brand

            const filter = {_id : new ObjectId(id)}
            const options = {upsert: true}
           const tech = {
            $set:{
              name: UpdateData.name,
              type: UpdateData.type,
              price: UpdateData.price,
              brand: UpdateData.brand,
              description: UpdateData.description,
              url: UpdateData.url,
              rating: UpdateData.rating
            }
           }
           app.get('/update/:brand/:id',async(req,res)=>{
            const id  = req.params.id
            const brand = req.params.brand
            const query = {_id : new ObjectId(id)}
            const result = await techDatabase.collection(`${brand}`).findOne(query)
            res.send(result)
          })

           const result = await techDatabase.collection(`${UpdateData.brand}`).updateOne(filter,tech,options)
           res.send(result)
        })

        app.patch('/addtocart/:userid',async(req,res)=>{
          const id = req.params.userid
          const cartData = req.body
         
          const filter  = {_id : new ObjectId(id)} 

          const updateCart = {
            $set:{
                cart : cartData
            }
          }
         
          const result = await techDatabase.collection('UserData').updateOne(filter,updateCart)
         
          res.send(result)
       })



      // Connect the client to the server	(optional starting in v4.7)
      
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
     
    }
  }
  run().catch(console.dir);

