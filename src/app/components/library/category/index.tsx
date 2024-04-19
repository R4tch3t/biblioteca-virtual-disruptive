import { Type_categories } from '@/pages/library/[name]';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Modal from './modal';
import Router from 'next/router';

interface PROPS {
  category: Type_categories
}

const CategoryComponent =  ({category}: PROPS) => {
    const [cookies, setCookie, removeCookie] = useCookies(['email', 'userName', 
        'isReader', 'isCreator' , 'isAdmin', 'remember']);
    const [loading, setLoading] = useState(false)
    const [role, setRole] = useState(0)
    const [contents, setContents] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [contentData, setContentData]:any = useState()
    
    useEffect(()=>{
      setRole(cookies.isAdmin?1:(cookies.isCreator?2:(cookies.isReader?3:0)))
    },[cookies])

    //getting all content data
    useEffect(()=>{
      renderData()
    },[])

    const renderData = async() => {
      const data = { category: category.name }
                  
      const response = await fetch('/api/library/category/get',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      }); 
      const respData = await response.json();
      if(respData.content){
        setContents(respData.content)
      }
    }

    const toggleModal = () => {
      setShowModal(!showModal)
    }

    const changeContentData=(content: any) => {
      setContentData(content)
      toggleModal()
    }

    const deleteContent = async (id: string) => {
      const data = { id }
                  
      const response = await fetch('/api/library/category/delete',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      }); 
      const respData = await response.json();

      if(respData.message==="success"){
        alert('Éxito el contenido se eliminó correctamente')            
      } else {
        alert('Ocurrío algún tipo de error, intente nuevamente')
      }
    }

    const deleteThisCategory = async () => {
      const data = { name: category.name }
                  
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
      Router.push('/')
    }

    
    return (<>
        {showModal && <Modal close={toggleModal} contentData={contentData} renderData={renderData} category={category} />}
        <div className="view login-view" style={{display: 'block'}}>          
            <div className="h-full flex justify-center mt-5">
                          
              <div className="flex w-full h-full lg:w-1/2 justify-center items-center bg-white rounded-[8px] p-5">
                <div className="relative flex items-center">
                <Link href={'/'}>
                  <button type="submit" style={{position: 'absolute', top: -5, left: -100, zIndex: 999, width: 105}} className="w-full flex justify-center bg-red-500 text-gray-100 p-4  rounded-full tracking-wide font-semibold  focus:outline-none focus:shadow-outline hover:bg-red-600 shadow-lg cursor-pointer transition ease-in duration-300 mb-5">
                    {'< Atras'}
                  </button>
                </Link>
                  <div className="w-full z-10">
                      <div style={{display: 'flex', justifyContent:'center'}}>
                        <Image src={`data:image/jpeg;base64,${category.cover}`} alt={''} width={400} height={400} />
                      </div>                        
                    <div className="text-center">
                      
                      <h1 className="mt-6 text-3xl font-bold text-gray-900">
                        {category?.name!}
                      </h1>
                      <p className="mt-2 text-sm text-gray-600">
                        {category?.description!}
                      </p>
                    </div>
                    <div style={{ overflowY: "auto", marginBottom: 10, maxHeight: 600 }} > {/* here scrollvie for content by user */}
                      <div style={{padding: 10}} >
                        {contents.map((content: any)=>{
                          
                          let base64Img: any = null
                          if(content.typeData === 1){
                            base64Img = `data:image/jpeg;base64,${content.image}`;
                          }
                          return (
                            <div key={content._id} className="rounded-xl shadow-md  w-full bg-gray rounded-lg p-12 flex flex-col justify-center items-center">
                              <h1 className='font-bold' >
                                {content.typeData===0?'Video URL':(
                                    content.typeData===1?'Imagen':(
                                      content.typeData===2?'Archivo de texto':''
                                      )
                                )}
                              </h1>
                              {base64Img && 
                                <div className="mb-8">
                                  <img className="object-center object-cover rounded-full h-36 w-36" src={base64Img} alt="photo" />
                                </div>
                              }
                                <div className="text-center">                                  
                                    {content.typeData===0 && <Link className="text-l text-gray-700 font-bold mb-2" href={content.videoURL} >{content.videoURL}</Link>}
                                    {content.typeData===2 && <p className="text-l text-gray-700 font-bold mb-2">{content.plainText}</p>}
                                    <p className="text-base text-gray-400 font-normal">Créditos: {content.userName}</p>
                                </div>  

                                {(role===1 || role===2) && 
                                <div style={{display: 'flex'}} >   
                                  <button onClick={()=>deleteContent(content._id)} type="submit" style={{height: 50, alignItems: 'center'}} disabled={loading}  className="flex justify-center bg-red-500 text-gray-100 p-4  rounded-full tracking-wide font-semibold  focus:outline-none focus:shadow-outline hover:bg-red-600 shadow-lg cursor-pointer transition ease-in duration-300 mb-5">
                                    {'Eliminar'}
                                  </button>
                                  <button type="submit" onClick={()=>{changeContentData(content)}}  style={{height: 50, alignItems: 'center'}} disabled={loading}  className="flex justify-center bg-yellow-500 text-gray-100 p-4  rounded-full tracking-wide font-semibold  focus:outline-none focus:shadow-outline hover:bg-yellow-600 shadow-lg cursor-pointer transition ease-in duration-300 mb-5">
                                    {'Editar'}
                                  </button>                        
                                </div>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div>
                        {role===1 && 
                          <button onClick={deleteThisCategory} type="submit" disabled={loading} className="w-full flex justify-center bg-red-500 text-gray-100 p-4  rounded-full tracking-wide font-semibold  focus:outline-none focus:shadow-outline hover:bg-red-600 shadow-lg cursor-pointer transition ease-in duration-300 mb-5">
                            {'Eliminar categoría'}
                          </button>
                        }
                        {(role===1 || role===2) && 
                          <Link href={`/library/${category.name}/new`}>
                            <button type="submit" disabled={loading} className="w-full flex justify-center bg-green-500 text-gray-100 p-4  rounded-full tracking-wide font-semibold  focus:outline-none focus:shadow-outline hover:bg-green-600 shadow-lg cursor-pointer transition ease-in duration-300 mb-5">
                              {'Subir contenido'}
                            </button>
                          </Link>
                        }
                        {(role===1) && 
                          <Link href={`/library/${category.name}/update`}> 
                            <button type="submit" disabled={loading} className="w-full flex justify-center bg-indigo-500 text-gray-100 p-4  rounded-full tracking-wide font-semibold  focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg cursor-pointer transition ease-in duration-300">
                              {'Editar'}
                            </button>
                          </Link>
                        }
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          </>
    )
}

export default CategoryComponent