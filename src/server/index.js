// server.js
//ADVERTENCIA: Por favor sólo es el esqueleto para un servidor de express y cumplir el requerimiento de la prueba
// Next esta apuntando a su propia API Route y se necesitaria cambiar las rutas para la llamada de esta API 
const express = require('express');
const app = express();
const PORT = 3001;
const { MongoClient, ServerApiVersion } = require('mongodb')

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3005 });

// Connection URI
const uri = `mongodb+srv://disruptive-test:${process.env.PASSWORD_DB}@cluster0.tnwsbpy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a new MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Middleware to parse JSON bodies
app.use(express.json());

// GET request handler
app.get('/api/data', (req, res) => {
  // Sample data
  const data = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ];
  
  res.json(data);
});

// POST request handler
app.post('/api/user/new', async (req, res) => {  
  
  try{

    // Connect the client to the server
    await client.connect();

    // Access the database
    const database = client.db("library")

    // Access the collection
    const usersDB = database.collection('users');
    
    // Insert the data into the collection
    const result = await usersDB.insertOne(req.body);

    res.status(200).json({ message: 'success' })
    
  }catch(e){
    console.log(e)
    res.status(500).json({ message: 'error' })
  } finally {
    client.close(true)
  }

});

// POST request handler
app.post('/api/user/get', async (req, res) => {  
  
  try{

    // Connect the client to the server
    await client.connect();

    // Access the database
    const database = client.db("library")

    // Access the collection
    const usersDB = database.collection('users');
    
    // Insert the data into the collection
    const result = await usersDB.insertOne(req.body);

    res.status(200).json({ message: 'success' })
    
  }catch(e){
    console.log(e)
    res.status(500).json({ message: 'error' })
  } finally {
    //client.close(true)
  }

});

app.post('/api/user/exists', async (req, res) => {  
  try{

    // Connect the client to the server
    await client.connect();

    // Access the database
    const database = client.db("library")

    // Access the collection
    const usersDB = database.collection('users');

    // Check if user already exists 
    const result = await usersDB.findOne(req.body);
    
    res.status(200).json({ exists: result ? true:false, result })    
    
  }catch(e){
    console.log(e)
    res.status(500).json({ exists: false, message: 'error' })
  } finally {
   // client.close(true)
  }
});

app.post('/api/library/new', async (req, res) => {  
  try{

    // Connect the client to the server
    await client.connect();

    // Access the database
    const database = client.db("library")

    // Access the collection
    const categoryDB = database.collection('category');        

    // Check if exist the name
    const exists = await categoryDB.findOne({name: req.body.name})
    
    if(exists){
        client.close(true)
        return res.status(200).json({ message: 'exists' })    
    }
    
    // Convert the image file to binary data
    const binaryData = Buffer.from(req.body.cover, 'base64');
    const newData = {...req.body, cover: binaryData}

    // Insert the data into the collection
    const result = await categoryDB.insertOne(newData);

    res.status(200).json({ message: 'success' })
    
  }catch(e){
    console.log(e)
    res.status(500).json({ message: 'error' })
  } finally {
   // client.close(true)
  }
});

app.post('/api/library/get/name', async (req, res) => {  

  try{

    // Connect the client to the server
    await client.connect();

    // Access the database
    const database = client.db("library")

    // Access the collection
    const categoryDB = database.collection('category');        

    // Check if exist the name
    const exists = await categoryDB.findOne({name: req.body.name})
    
    if(exists){
      res.status(200).json({ message: 'exists', category: exists })    
    }else{    
      res.status(404).json({ message: 'Not found' })
    }
    
  }catch(e){
    console.log(e)
    res.status(500).json({ message: 'error' })
  } finally {
   // client.close(true)
  }

})

app.post('/api/library/get', async (req, res) => {  
  try{

    // Connect the client to the server
    await client.connect();

    // Access the database
    const database = client.db("library")

    // Access the collection
    const categoryDB = database.collection('category');        

    // Check if exist the name
    const exists = await categoryDB.find({}).toArray()
    
    if(exists){
      res.status(200).json({ message: 'exists', category: exists })    
    }else{    
      res.status(404).json({ message: 'Not found' })
    }
    
  }catch(e){
    console.log(e)
    res.status(500).json({ message: 'error' })
  } finally {
    //client.close(true)
  }
})

app.post('/api/library/delete', async (req, res) => {  
  try{

    // Connect the client to the server
    await client.connect();

    // Access the database
    const database = client.db("library")

    // Access the collection
    const categoryDB = database.collection('category');        
    
    //const filter = { _id: new ObjectId(req.body.id) };
    const filter = {name: req.body.name}

      // Insert the data into the collection
    const result = await categoryDB.deleteOne(filter);    
    
    // Deleting content of category

    // Access the database
    const databaseContent = client.db("category")

    // Access the collection
    const categoryContentDB = database.collection(filter.name);

    // Dropping data
    await categoryContentDB.drop()

    res.status(200).json({ message: 'success' })
    
  }catch(e){
    console.log(e)
    res.status(500).json({ message: 'error' })
  } finally {
    //client.close(true)
  }
});

app.post('/api/library/update', async (req, res) => {  
  try{
    
    // Connect the client to the server
    await client.connect();

    // Access the database
    const database = client.db("library")

    // Access the collection
    const categoryDB = database.collection('category');        
    //const filter = { _id: new ObjectId(req.body.id) };
    const filter = {name: req.body.name}
    const binaryData = Buffer.from(req.body.updated.cover, 'base64');
    let updateDoc = {
      $set: {
        ...req.body.updated,
        cover: binaryData
      }
    };
    
    const result = await categoryDB.updateOne(filter, updateDoc);

    res.status(200).json({ message: 'success' })
    
  }catch(e){
    console.log(e)
    res.status(500).json({ message: 'error' })
  } finally {
    client.close(true)
  }
});

app.post('/api/library/category/new', async (req, res) => {  
  try{

    // Connect the client to the server
    await client.connect();

    // Access the database
    const database = client.db("category")

    // Access the collection
    const categoryDB = database.collection(req.body.category);        
    
    if(req.body.typeData === 0 || req.body.typeData === 2){ // Video || text
      const newData = {...req.body.data, typeData: req.body.typeData}
      const result = await categoryDB.insertOne(newData);
    }else if (req.body.typeData === 1){// Image
      // Convert the image file to binary data
      const binaryData = Buffer.from(req.body.data.image, 'base64');
      const newData = {...req.body.data, image: binaryData, typeData: req.body.typeData}

      // Insert the data into the collection
      const result = await categoryDB.insertOne(newData);
    }


    res.status(200).json({ message: 'success' })
    
  }catch(e){
    console.log(e)
    res.status(500).json({ message: 'error' })
  } finally {
   // client.close(true)
  }
});

app.post('/api/library/category/get', async (req, res) => { 
  try{

    // Connect the client to the server
    await client.connect();

    // Access the database
    const database = client.db("category")

    // Access the collection
    const categoryDB = database.collection(req.body.category);        

    // Check if exist the name
    const exists = await categoryDB.find({}).toArray()
    
    if(exists){
      res.status(200).json({ message: 'exists', content: exists })    
    }else{    
      res.status(404).json({ message: 'Not found' })
    }
    
  }catch(e){
    console.log(e)
    res.status(500).json({ message: 'error' })
  } finally {
    //client.close(true)
  }
})

app.post('/api/library/category/udpate', async (req, res) => { 
  try{
    
    // Connect the client to the server
    await client.connect();

    // Access the database
    const database = client.db("category")

    // Access the collection
    const categoryDB = database.collection(req.body.category);        
    const filter = { _id: new ObjectId(req.body.id) };
    let updateDoc = {}
    if(req.body.typeData === 0 ){ // Video
      
    updateDoc = {
      $set: {
        videoURL: req.body.updated,
      }
    };

    
    }else if(req.body.typeData === 1 ){ // Image
      const binaryData = Buffer.from(req.body.updated, 'base64');

      updateDoc = {
        $set: {
          image: binaryData,
        }
      };
  
      
    }else if (req.body.typeData === 2){// Text
      
      updateDoc = {
        $set: {
          plainText: req.body.updated,
        }
      };
  
    }
    
    const result = await categoryDB.updateOne(filter, updateDoc);

    res.status(200).json({ message: 'success' })
    
  }catch(e){
    console.log(e)
    res.status(500).json({ message: 'error' })
  } finally {
    //client.close(true)
  }
})

app.post('/api/library/category/delete', async (req, res) => { 
  try{

    // Connect the client to the server
    await client.connect();

    // Access the database
    const database = client.db("category")

    // Access the collection
    const categoryDB = database.collection(req.body.category);        
    
    const filter = { _id: new ObjectId(req.body.id) };

      // Insert the data into the collection
    const result = await categoryDB.deleteOne(filter);    


    res.status(200).json({ message: 'success' })
    
  }catch(e){
    console.log(e)
    res.status(500).json({ message: 'error' })
  } finally {
    //client.close(true)
  }
})

app.post('/api/websocket', async (req, res) => { 
  wss.on('connection', async (ws) => {
    console.log('Client connected');
    // Ready for listening from mongodb any change data

    // Connect the client to the server
    await client.connect();

    // Access the database
    const databaseLB = client.db("library")

    // Access the collection
    const categoriesDB = databaseLB.collection('category');


    const categories = await categoriesDB.find({}).toArray()

      categories.map(async (category)=>{            
      
          // Access the database
          const database = client.db("category")

          // Access the collection
          const categoryDB = database.collection(category.name);        

          const changeStream = categoryDB.watch()
          // Check if exist the name
          const existsVideo = await categoryDB.find({typeData: 0}).toArray()
          const existsImage = await categoryDB.find({typeData: 1}).toArray()
          const existsText = await categoryDB.find({typeData: 2}).toArray()
          let videos = existsVideo.length;
          let images = existsImage.length;
          let texts = existsText.length;
          
          changeStream.on('change', async (change) => {
              // Send the change event to the connected WebSocket client
              //ws.send(JSON.stringify(change));
              const existsVideo = await categoryDB.find({typeData: 0}).toArray()
              const existsImage = await categoryDB.find({typeData: 1}).toArray()
              const existsText = await categoryDB.find({typeData: 2}).toArray()

              videos = existsVideo.length;
              images = existsImage.length;
              texts = existsText.length;

              ws.send(JSON.stringify({[category.name]: {videos, images, texts}}));
          });

          ws.send(JSON.stringify({[category.name]: {videos, images, texts}}));
          
      })
      
      ws.on('close', () => {
          console.log('Client disconnected');
      });
});
  res.end();
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});