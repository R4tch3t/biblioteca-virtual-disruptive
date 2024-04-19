import { Type_categories } from '@/pages/library/[name]';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from "react";
import { useCookies } from "react-cookie";

type PROPS = {
  category: Type_categories
}
const UpdateLibraryComponent = ({category}:PROPS) => {
    const [cookies, setCookie, removeCookie] = useCookies(['email', 'userName', 
        'isReader', 'isCreator' , 'isAdmin', 'remember']);
    const [selectedCover, setSelectedCover]: any = useState(null);
    const [selectedCover64, setSelectedCover64]: any = useState(category.cover);
    const [name, setName] = useState(category.name)
    const [description, setDescription] = useState(category.description)
    const [allowData, setAllowData]: any = useState(category.allowData) // 0 = allow videos, 1 = allow image, 2 = allow text
    const [allowUsers, setAllowUsers] = useState(category.allowUsers) // 1 = allow readers, 2 = allow creators
    const [loading, setLoading] = useState(false)
    const [errorMessageCover, setErrorMessageCover] = useState('')
    const [errorMessageName, setErrorMessageName] = useState('')
    const [errorMessageDescription, setErrorMessageDescription] = useState('')
    const [errorMessageAllowData, setErrorMessageAllowData] = useState('')
    const [errorMessageAllowUser, setErrorMessageAllowUser] = useState('')

    const onSubmitHandle = async (e: FormEvent<HTMLFormElement>) => {
        if(loading){
            return
        }
        

        try {
            e.preventDefault()
            // Validating form data

            // Validate cover
            if(!selectedCover){
              setErrorMessageCover('Selecciona una portada para esta categoría')
              return
            }

            if(!name){
              setErrorMessageName('Ingresa un nombre, no puede quedar en blanco')
              return
            }

            if(!description){
              setErrorMessageDescription('Ingresa una descripción, no puede quedar en blanco')
              return
            }

            if(!allowData[0]&&!allowData[1]&&!allowData[2]){
              setErrorMessageAllowData('Selecciona al menos un permiso para el contenido')
              return
            }

            if(!allowUsers){
              setErrorMessageAllowUser('Selecciona el permiso para usuario')
              return
            }

            setLoading(true)
            
            
            
              
              const data = { updated: {
                cover: selectedCover64, 
                name, 
                description, 
                allowData, 
                allowUsers
              }, name: category.name }
              
              const response = await fetch('/api/library/update',{
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(data)
              }); 
              const respData = await response.json();

              if(respData.message==="success"){
                alert('Éxito la categoría se actualizó correctamente')
              } else {
                alert('Ocurrío algún tipo de error, intente nuevamente')
              }
              setLoading(false)
            
        }catch(e){
            console.log(e)
        }
        
    }

    const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
      setErrorMessageCover('')
      setSelectedCover(event?.target?.files![0]);
      const reader: any = new FileReader();
      reader.onload = async () => {
          const base64Data = reader?.result?.split(',')[1];
          setSelectedCover64(base64Data)
      }

       
      reader.readAsDataURL(event?.target?.files![0]);

    };

    const onChangeName = async (e: ChangeEvent<HTMLInputElement>) => {
        setName(e?.currentTarget?.value!)
        setErrorMessageName('')
    }

    const onChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
        setDescription(e.currentTarget.value)
        setErrorMessageDescription('')
    }

    const onChangeAllowVideo=(e: ChangeEvent<HTMLInputElement>) => {      
      const newAllowData = [...allowData]
      newAllowData[0] = allowData[0] === 1 ? 0 : 1;
      setAllowData(newAllowData)
      setErrorMessageAllowData('')
    }

    const onChangeAllowImage=(e: ChangeEvent<HTMLInputElement>) => {      
      const newAllowData = [...allowData]
      newAllowData[1] = allowData[1] === 1 ? 0 : 1;
      setAllowData(newAllowData)
      setErrorMessageAllowData('')
    }

    const onChangeAllowText=(e: ChangeEvent<HTMLInputElement>) => {      
      const newAllowData = [...allowData]
      newAllowData[2] = allowData[2] === 1 ? 0 : 1;
      setAllowData(newAllowData)
      setErrorMessageAllowData('')
    }

    const onChangeAllowUser=(user: number) => {      
      setAllowUsers(user)
      setErrorMessageAllowUser('')
    }

    
    return (
        <div className="view login-view" style={{display: 'block'}}>
            <div className="h-full flex justify-center mt-5">
              
              <div className="flex w-full h-full lg:w-1/2 justify-center items-center bg-white rounded-[8px] p-5">
                <div className="relative flex items-center">
                  <div className="w-full z-10">                    
                    <div className="text-center">
                      <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Actualizar categoría
                      </h2>
                      <p className="mt-2 text-sm text-gray-600">
                        Actualiza la categoría aquí
                      </p>
                    </div>
                    <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={onSubmitHandle} >
                      <span className="mb-5" >Seleccionar portada:</span> <br/>
                      <input type="file" id="coverInput" accept="image/*" onChange={handleCoverChange} />
                      {selectedCover64 && (
                        <img src={`data:image/jpeg;base64,${selectedCover64}`} alt="Preview" style={{ maxWidth: '100%', borderRadius: 10 }} />
                      )}
                      {errorMessageCover && 
                        <div style={{maxWidth: 500}}>
                          <span className="text-red-500"  >{errorMessageCover}</span> 
                        </div>
                      }
                      <div className="relative">                        
                        <label className="text-sm font-bold text-gray-700 tracking-wide">Nombre</label>
                        <input onChange={onChangeName} value={name} readOnly className="w-full text-base py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" style={{color: 'black'}} type="" placeholder="Matemáticas, Ciencias, Deportes" />
                        {errorMessageName && 
                          <div style={{maxWidth: 500}}>
                            <span className="text-red-500"  >{errorMessageName}</span> 
                          </div>
                        }
                      </div>
                      <div className="mt-8 content-center">
                        <label className="text-sm font-bold text-gray-700 tracking-wide">Descripción</label>
                        <input onChange={onChangeDescription} value={description} className="w-full content-center text-base py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" style={{color: 'black'}} type="" placeholder="Descripción de la categoría" />
                        {errorMessageDescription && 
                          <div style={{maxWidth: 500}}>
                            <span className="text-red-500"  >{errorMessageDescription}</span> 
                          </div>
                        }
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input onChange={onChangeAllowVideo} checked={allowData[0]===1} id="allow_video" name="allow_video" type="checkbox" className="h-4 w-4 bg-indigo-500 focus:ring-indigo-400 border-gray-300 rounded" />
                          <label htmlFor='allow_video' className="ml-2 block text-sm text-gray-900">Permitir videos</label>
                        </div>    
                      </div>
                        
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input onChange={onChangeAllowImage} checked={allowData[1]===1} id="allow_image" name="allow_image" type="checkbox" className="h-4 w-4 bg-indigo-500 focus:ring-indigo-400 border-gray-300 rounded" />
                          <label htmlFor='allow_image' className="ml-2 block text-sm text-gray-900">Permitir imagenes</label>
                        </div>                        
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input onChange={onChangeAllowText} checked={allowData[2]===1} id="allow_text" name="allow_text" type="checkbox" className="h-4 w-4 bg-indigo-500 focus:ring-indigo-400 border-gray-300 rounded" />
                          <label htmlFor='allow_text' className="ml-2 block text-sm text-gray-900">Permitir texto</label>
                        </div>                        
                      </div>
                      {errorMessageAllowData && 
                          <div style={{maxWidth: 500}}>
                            <span className="text-red-500"  >{errorMessageAllowData}</span> 
                          </div>
                      }
                      <br/>
                      <span className="mb-5" >Permisos para usuarios:</span>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input onChange={()=>onChangeAllowUser(1)} checked={allowUsers===1} id="allow_reader" name="allow_reader" type="checkbox" className="h-4 w-4 bg-indigo-500 focus:ring-indigo-400 border-gray-300 rounded" />
                          <label htmlFor='allow_reader' className="ml-2 block text-sm text-gray-900">Lectura</label>
                        </div>                        
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input onChange={()=>onChangeAllowUser(2)} checked={allowUsers===2} id="allow_creator" name="allow_creator" type="checkbox" className="h-4 w-4 bg-indigo-500 focus:ring-indigo-400 border-gray-300 rounded" />
                          <label htmlFor='allow_creator' className="ml-2 block text-sm text-gray-900">Escritura</label>
                        </div>                        
                      </div>        

                      {errorMessageAllowUser && 
                          <div style={{maxWidth: 500}}>
                            <span className="text-red-500"  >{errorMessageAllowUser}</span> 
                          </div>
                      }              


                      <div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center bg-indigo-500 text-gray-100 p-4  rounded-full tracking-wide font-semibold  focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg cursor-pointer transition ease-in duration-300">
                            {!loading?'Actualizar información':'Actualizando...'}
                        </button>
                      </div>

                      <div>
                        <Link href={'/'}>
                          <button type="button" disabled={loading} className="w-full flex justify-center bg-red-500 text-gray-100 p-4  rounded-full tracking-wide font-semibold  focus:outline-none focus:shadow-outline hover:bg-red-600 shadow-lg cursor-pointer transition ease-in duration-300">
                              {'Cancelar'}
                          </button>
                        </Link>
                      </div>
                      
                    </form>
                  </div>
                </div>
              </div>

            </div>
          </div>
    )
}

export default UpdateLibraryComponent