import { MongoClient, ServerApiVersion } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
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
    res: any
) {    
    
    wss.on('connection', async (ws: any) => {
        console.log('Client connected');
        // Ready for listening from mongodb any change data

        // Connect the client to the server
        await client.connect();

        // Access the database
        const databaseLB = client.db("library")

        // Access the collection
        const categoriesDB = databaseLB.collection('category');


        const categories = await categoriesDB.find({}).toArray()

        categories.map(async (category: any)=>{            
        
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
}