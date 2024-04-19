import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Search from "../search";
let staticsG = {}
const Boilerplate = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['email', 'userName', 'isReader', 'isCreator' , 'isAdmin', 'remember']);
    const [role, setRole] = useState(-1)
    const [messageForRole, setMessageForRole] = useState('Crea una cuenta para acceder al contenido.')
    const [categories, setCategories] = useState([])
    const [statics, setStatics]:any = useState({})

    useEffect(()=>{
        if(cookies.isAdmin){
            setRole(1)
            setMessageForRole('Ya que eres administrador podrás crear, leer, actualizar y eliminar categorías')
        }
        if(cookies.isCreator){
            setRole(2)
            setMessageForRole('Ya que eres creador podrás crear, leer y actualizar categorías')
        }
        if(cookies.isReader){
            setRole(3)
            setMessageForRole('Ya que eres lector sólo podrás leer categorías')
        }
    },[cookies])

    useEffect(()=>{
        // Fetching for connect the mongodb stream and websocket
        const response = fetch('/api/websocket',{
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
        });  
        response.then(()=>{
            let wsURL = `ws://localhost:3005/api/websocket`
            if(process.env.NODE_ENV==='production'){
                //wsURL = process?.env?.WS_URL!
                wsURL = "biblioteca-virtual-disruptive.vercel.app:3005" 
                wsURL = `wss://${wsURL}/api/websocket`
            }
            const ws = new WebSocket(wsURL);
        
            ws.onopen = () => {
                console.log('WebSocket connected');
            };
        
            //wetting statics from mongoDB
            ws.onmessage = (event) => {            
                const parsed = JSON.parse(event.data)
                staticsG={...staticsG, ...parsed}
                setStatics(staticsG)
            };
        
            ws.onclose = () => {
                console.log('WebSocket disconnected');
            };
        })
      },[])

    const renderData = async() => {
        const data = { }
                    
        const response = await fetch('/api/library/get',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }); 
        const respData = await response.json();
        if(respData.category){
            setCategories(respData.category)
        }
    }

    useEffect(()=>{
        renderData()
    },[])

    const deleteThisCategory = async (name: string) => {
        const data = { name }
                    
        const response = await fetch('/api/library/delete',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }); 
        const respData = await response.json();
  
        if(respData.message==="success"){
          alert('Éxito la categoría se eliminó correctamente')            
        } else {
          alert('Ocurrío algún tipo de error, intente nuevamente')
        }
        await renderData()
    }

    const handleSearch = async (name: string) => {
        const data = { name }
                    
        const response = await fetch('/api/library/get/name',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }); 
        const respData = await response.json();
        
        if(respData.category){

            setCategories([respData.category] as any)
        }
    }

    return (
        <section>
            <div className="py-16">
                <div className="mx-auto px-6 max-w-6xl text-gray-500">                

                    <div className="text-center">
                        <h2 className="text-3xl text-gray-950 dark:text-white font-semibold">Selecciona tu categoría de interés</h2>
                        <p className="mt-6 text-gray-700 dark:text-gray-300">{messageForRole}</p>
                    </div>
                    
                    <Search handleSearch={handleSearch} />

                    <div style={{ overflowY: "auto", marginBottom: 10, maxHeight: 600 }} > {/* here scrollview for content by user */}
                      <div style={{padding: 10}} >
                        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {categories?.map((category: any)=>{
                                return (
                                    <div key={category._id} className="relative group overflow-hidden p-8 rounded-xl bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
                                        <div aria-hidden="true" className="inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b from-blue-500 to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10"></div>
                                        <div className="relative">
                                            <div className="border border-blue-500/10 flex relative *:relative *:m-auto rounded-lg dark:bg-gray-900 dark:border-white/15 before:rounded-[7px] before:absolute before:inset-0 before:border-t before:border-white before:from-blue-100 dark:before:border-white/20 before:bg-gradient-to-b dark:before:from-white/10 dark:before:to-transparent before:shadow dark:before:shadow-gray-950">
                                                <Image src={`data:image/jpeg;base64,${category.cover}`} alt={''} width={400} height={400} />                          
                                                
                                            </div>
                                            <h1 style={{textAlign: 'center'}} className="font-bold" >{category.name}</h1>
                                            <div className="mt-6 pb-6 rounded-b-[--card-border-radius]">
                                                <p className="text-gray-700 dark:text-gray-300">{category.description}</p>
                                            </div>

                                            {role !== -1 &&
                                                <div className="flex gap-3 -mb-8 py-4 border-t border-gray-200 dark:border-gray-800">
                                                    <Link href={`/library/${category.name}`} download="/" className="group rounded-xl disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100 dark:disabled:border-gray-800/50 disabled:dark:bg-gray-900 dark:*:disabled:!text-white text-gray-950 bg-gray-100 hover:bg-gray-200/75 active:bg-gray-100 dark:text-white dark:bg-gray-500/10 dark:hover:bg-gray-500/15 dark:active:bg-gray-500/10 flex gap-1.5 items-center text-sm h-8 px-3.5 justify-center">
                                                        <span style={{color: 'green'}} >Ver</span>                                                    
                                                    </Link>

                                                    {role===1 && 
                                                        <>
                                                            <Link href={`/library/${category.name}/update`} download="/" className="group rounded-xl disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100 dark:disabled:border-gray-800/50 disabled:dark:bg-gray-900 dark:*:disabled:!text-white text-gray-950 bg-gray-100 hover:bg-gray-200/75 active:bg-gray-100 dark:text-white dark:bg-gray-500/10 dark:hover:bg-gray-500/15 dark:active:bg-gray-500/10 flex gap-1.5 items-center text-sm h-8 px-3.5 justify-center">
                                                                <span style={{color: 'blueviolet'}} >Editar</span>                                                    
                                                            </Link>
                                                            <button onClick={()=>deleteThisCategory(category.name)} className="group rounded-xl disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100 dark:disabled:border-gray-800/50 disabled:dark:bg-gray-900 dark:*:disabled:!text-white text-gray-950 bg-gray-100 hover:bg-gray-200/75 active:bg-gray-100 dark:text-white dark:bg-gray-500/10 dark:hover:bg-gray-500/15 dark:active:bg-gray-500/10 flex gap-1.5 items-center text-sm h-8 px-3.5 justify-center">
                                                                <span style={{color: 'red'}} >Eliminar</span>                                                    
                                                            </button>
                                                        </>
                                                    }

                                                </div>
                                            }

                                            <div style={{marginTop: 25}}>
                                                <span >Videos: </span><span className="font-bold">{statics[category.name]?.videos?statics[category.name]?.videos:0}</span>
                                                <span style={{marginLeft: 15}} >Imagenes: </span><span className="font-bold">{statics[category.name]?.images?statics[category.name]?.images:0}</span>
                                                <span style={{marginLeft: 15}} >Textos: </span><span className="font-bold">{statics[category.name]?.texts?statics[category.name]?.texts:0}</span>
                                            </div>

                                            
                                            
                                        </div>
                                    </div>
                                )
                            })}
                        

                        
                        
                        </div>
                    </div>
                </div>

                </div>
            </div>
</section>
    )
}

export default Boilerplate