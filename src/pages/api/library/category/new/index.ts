import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient, ServerApiVersion } from 'mongodb'

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
    client.close(true)
  }
}