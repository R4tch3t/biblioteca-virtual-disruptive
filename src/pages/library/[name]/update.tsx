"use client";
import Update from "@/app/components/library/update";
import '@/app/globals.css';
import { MongoClient, ServerApiVersion } from "mongodb";
import { GetStaticPaths, GetStaticProps } from "next";
import { Type_categories } from ".";

interface Props {
    name: string,
    category: Type_categories
}

const UpdateCategoryPage = (props: Props) => {
    
    return (
        <div className="card w-full h-full p-0">
            <div className="card-body h-full w-full p-0 ">
                <Update category={props.category} />
            </div>
        </div>        
    )
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  
    const uri = `mongodb+srv://disruptive-test:${process.env.PASSWORD_DB}@cluster0.tnwsbpy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    
    // Create a new MongoClient
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    let categories:any=[]
    try{
    
      // Connect the client to the server
      await client.connect();
    
      // Access the database
      const database = client.db("library")
    
      // Access the collection
      const categoryDB = database.collection('category');        
    
      // Check if exist the name
      const exists = await categoryDB.find({}).toArray()
      
      
      categories = exists
      
      
    }catch(e){
      console.log(e)
    } finally {
      client.close(true)
      
      return {
        paths: categories?.map(({name}: any)=>({
          params: { name:name+"" }
        })),
        fallback: 'blocking'
    }  
    }
    
}

export const getStaticProps: GetStaticProps = async ({params}) => {
    const {name}: any = params as {name: string}     
      
    const uri = `mongodb+srv://disruptive-test:${process.env.PASSWORD_DB}@cluster0.tnwsbpy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  
    // Create a new MongoClient
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  
    let category:any={}
    try{
  
      // Connect the client to the server
      await client.connect();
  
      // Access the database
      const database = client.db("library")
  
      // Access the collection
      const categoryDB = database.collection('category');        
  
      // Check if exist the name
      const exists: any = await categoryDB.findOne({name})
      
      exists._id = exists?._id?.toString();
      exists.cover = exists?.cover?.toString('base64');    
      
      category = exists
      
    }catch(e){
      console.log(e)
    } finally {
      client.close(true)
      if(!category){
        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
      
      return {
        props: {
          name,
          category,
        },
        revalidate: 86400
      }
    }
    }
    
    export default UpdateCategoryPage