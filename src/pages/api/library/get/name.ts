import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient, ServerApiVersion } from 'mongodb'

type ResponseData = {
  message: string
  category?: any
}

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
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
    client.close(true)
  }
}