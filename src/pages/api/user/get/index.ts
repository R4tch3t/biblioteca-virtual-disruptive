import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient, ServerApiVersion } from 'mongodb'

type ResponseData = {
  exists: boolean,
  message?: string
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
    const usersDB = database.collection('users');

    // Check if user already exists 
    const result = await usersDB.findOne(req.body);
    
    res.status(200).json({ exists: result ? true:false })    
    
  }catch(e){
    console.log(e)
    res.status(500).json({ exists: false, message: 'error' })
  } finally {
    client.close(true)
  }
}