import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'

type ResponseData = {
  message: string
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
    client.close(true)
  }
}