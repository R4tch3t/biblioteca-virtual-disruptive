import { Type_categories } from '@/pages/library/[name]';
import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

interface PROPS {
  category: Type_categories
}

const NewCategoryComponent = ({category}: PROPS) => {
    const [cookies, setCookie, removeCookie] = useCookies(['email', 'userName', 
        'isReader', 'isCreator' , 'isAdmin', 'remember']);
    const [videoURL, setVideoURL] = useState('')
    const [selectedImage, setSelectedImage]: any = useState(null);
    const [selectedImage64, setSelectedImage64]: any = useState(null);
    const [selectedTxt, setSelectedTxt]: any = useState(null);
    const [plainText, setPlainText] = useState('')
    const [allowData, setAllowData] = useState([0,0,0]) // 0 = allow videos, 1 = allow image, 2 = allow text
    const [allowUsers, setAllowUsers] = useState(0) // 1 = allow readers, 2 = allow creators
    const [loading, setLoading] = useState(false)
    const [role, setRole] = useState(0)
    const [errorMessage, setErrorMessage] = useState('')
    
    useEffect(()=>{
      setRole(cookies.isAdmin?1:(cookies.isCreator?2:(cookies.isReader?2:0)))
    },[cookies])

    const onChangeVideoURL = async (e: ChangeEvent<HTMLInputElement>) => {
      setVideoURL(e?.currentTarget?.value!)
    }

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {      
      setSelectedImage(event?.target?.files![0]);
      const reader: any = new FileReader();
      reader.onload = async () => {
        const base64Data = reader?.result?.split(',')[1];
        setSelectedImage64(base64Data)
      }

      reader.readAsDataURL(event?.target?.files![0]);

    };

    const handleTxtChange = (event: ChangeEvent<HTMLInputElement>) => {      
      setSelectedTxt(event?.target?.files![0]);
      const reader: any = new FileReader();
      reader.onload = async () => {
        setPlainText(reader?.result!)
      }
      reader.readAsText(event?.target?.files![0]);
    };

    const handleChangeTextArea = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setPlainText(event.currentTarget.value)
    }

    const onChangeAllowVideo=(e: ChangeEvent<HTMLInputElement>) => {      
      const newAllowData = [0,0,0]
      newAllowData[0] = allowData[0] === 1 ? 0 : 1;
      setAllowData(newAllowData)
      setErrorMessage('')
    }

    const onChangeAllowImage=(e: ChangeEvent<HTMLInputElement>) => {      
      const newAllowData = [0,0,0]
      newAllowData[1] = allowData[1] === 1 ? 0 : 1;
      setAllowData(newAllowData)
      setErrorMessage('')
    }

    const onChangeAllowText=(e: ChangeEvent<HTMLInputElement>) => {      
      const newAllowData = [0,0,0]
      newAllowData[2] = allowData[2] === 1 ? 0 : 1;
      setAllowData(newAllowData)
      setErrorMessage('')
    }

    function validarURL(url: string) {
      
      const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    
      return regex.test(url);
    }

    const onSubmitContent = async () => {
      if(loading){
        return
      }

      if(allowData[0]===1){
        try{
          if(!videoURL||!validarURL(videoURL)){
            setErrorMessage('Introduzca una URL valida')
            return;
          }
          setLoading(true)
          const data = { data: {userName: cookies.userName, videoURL }, category: category.name, typeData:0 }
                
          const response = await fetch('/api/library/category/new',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          }); 
          const respData = await response.json();

          if(respData.message==="success"){
            await Router.push(`/library/${category.name}`)
            alert('Éxito el contenido se subió correctamente')
            
          } else {
            alert('Ocurrío algún tipo de error, intente nuevamente')
          }
          
        }catch(e){
          console.log(e)
        }        
      }

      if(allowData[1]===1){
        try{
          if(!selectedImage){
            setErrorMessage('Seleccione una imagen')
            return;
          }
          setLoading(true)
          const data = { data: {userName: cookies.userName, image: selectedImage64 }, category: category.name, typeData:1 }
                
          const response = await fetch('/api/library/category/new',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          }); 
          const respData = await response.json();

          if(respData.message==="success"){
            await Router.push(`/library/${category.name}`)
            alert('Éxito el contenido se subió correctamente')            
          } else {
            alert('Ocurrío algún tipo de error, intente nuevamente')
          }
          
        }catch(e){
          console.log(e)
        }        
      }

      if(allowData[2]===1){
        try{
          if(!plainText){
            setErrorMessage('Seleccione un archivo de texto')
            return;
          }
          setLoading(true)
          const data = { data: {userName: cookies.userName, plainText }, category: category.name, typeData:2 }
                
          const response = await fetch('/api/library/category/new',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          }); 
          const respData = await response.json();

          if(respData.message==="success"){
            await Router.push(`/library/${category.name}`)
            alert('Éxito el contenido se subió correctamente')            
          } else {
            alert('Ocurrío algún tipo de error, intente nuevamente')
          }
          
        }catch(e){
          console.log(e)
        }        
      }

      setLoading(false)
    }
    
    let allowTxt = allowData[2] === 1
    
    return (
        <div className="view login-view" style={{display: 'block', minHeight: 700}}>
            <div className="h-full flex justify-center mt-5">
              
              <div className="flex w-full h-full lg:w-1/2 justify-center items-center bg-white rounded-[8px] p-5">
                <div className="relative flex items-center">
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
                    <div  > {/* here scrollvie for content by user */}
                      
                      
                    </div>
                    <div>

                      {category.allowData[0]&&
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input onChange={onChangeAllowVideo} checked={allowData[0]===1} id="allow_video" name="allow_video" type="checkbox" className="h-4 w-4 bg-indigo-500 focus:ring-indigo-400 border-gray-300 rounded" />
                            <label htmlFor='allow_video' className="ml-2 block text-sm text-gray-900">Subir video</label>
                          </div>    
                        </div>
                      }

                      {category.allowData[1]&&  
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input onChange={onChangeAllowImage} checked={allowData[1]===1} id="allow_image" name="allow_image" type="checkbox" className="h-4 w-4 bg-indigo-500 focus:ring-indigo-400 border-gray-300 rounded" />
                            <label htmlFor='allow_image' className="ml-2 block text-sm text-gray-900">Subir imagen</label>
                          </div>                        
                        </div>
                      }

                      {category.allowData[2]&&
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input onChange={onChangeAllowText} checked={allowData[2]===1} id="allow_text" name="allow_text" type="checkbox" className="h-4 w-4 bg-indigo-500 focus:ring-indigo-400 border-gray-300 rounded" />
                            <label htmlFor='allow_text' className="ml-2 block text-sm text-gray-900">Subir texto</label>
                          </div>                        
                        </div>
                      }
                      {allowData[0]===1 && 
                        <div>
                            <input onChange={onChangeVideoURL} className="w-full text-base py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" style={{color: 'black'}} type="" placeholder="Introduce una url de un video" />
                        </div>
                      }
                      {allowData[1] === 1 &&
                        <div>
                          <span className="mb-5" >Seleccionar imagen:</span> <br/>
                          <input type="file" id="coverInput" accept="image/*" onChange={handleImageChange} />
                          {selectedImage && (
                            <img src={URL.createObjectURL(selectedImage)} alt="Preview" style={{ maxWidth: '100%', borderRadius: 10 }} />
                          )}
                        </div>
                      }
                      {allowData[2] === 1 &&
                        <div>
                          <span className="mb-5" >Seleccionar archivo txt:</span> <br/>
                          <input type="file" id="txtInput" accept=".txt" onChange={handleTxtChange} />
                          <br></br>
                          {plainText && (                            
                            <textarea onChange={handleChangeTextArea} value={plainText} style={{width: '100%'}} >  </textarea>
                          )}
                        </div>
                      }
                    </div>
                    {errorMessage && 
                      <div style={{maxWidth: 500}}>
                        <span className="text-red-500"  >{errorMessage}</span> 
                      </div>
                    }
                    <br></br>
                    {(allowData[0] === 1 || allowData[1] === 1 || allowData[2] === 1) && 
                      <button type="submit" onClick={onSubmitContent} disabled={loading} className="w-full flex justify-center bg-green-500 text-gray-100 p-4  rounded-full tracking-wide font-semibold  focus:outline-none focus:shadow-outline hover:bg-green-600 shadow-lg cursor-pointer transition ease-in duration-300 mb-5">
                        {loading?'Cargando...':'Subir contenido'}
                      </button>
                    }
                      <Link href={`/library/${category.name}`} >
                        <button type="submit" disabled={loading} className="w-full flex justify-center bg-red-500 text-gray-100 p-4  rounded-full tracking-wide font-semibold  focus:outline-none focus:shadow-outline hover:bg-red-600 shadow-lg cursor-pointer transition ease-in duration-300 mb-5">
                          {'Cancelar'}
                        </button>
                      </Link>

                  </div>
                </div>
              </div>

            </div>
          </div>
    )
}

export default NewCategoryComponent