import { ChangeEvent, useState } from "react";

const ModalCategory = ({close, contentData, renderData, category}:any) => {
    const [selectedImage, setSelectedImage]: any = useState(null);
    const [selectedImage64, setSelectedImage64]: any = useState(null);
    const [videoURL, setVideoURL] = useState('')
    const [selectedTxt, setSelectedTxt]: any = useState(null);
    const [plainText, setPlainText] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

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

      function validarURL(url: string) {
      
        const regex = /^(ftp|http|https):\/\/[^ "]+$/;
      
        return regex.test(url);
      }

      const onSubmitContent = async () => {
        if(loading){
          return
        }
  
        if(contentData.typeData===0){
          try{
            if(!videoURL||!validarURL(videoURL)){
              setErrorMessage('Introduzca una URL valida')
              return;
            }
            setLoading(true)
            const data = { id: contentData._id, updated: videoURL, category: category.name, typeData: contentData.typeData }
                  
            const response = await fetch('/api/library/category/update',{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }); 
            const respData = await response.json();
  
            if(respData.message==="success"){
              alert('Éxito el contenido se actualizó correctamente')
              
            } else {
              alert('Ocurrío algún tipo de error, intente nuevamente')
            }
            
          }catch(e){
            console.log(e)
          }        
        }
  
        if(contentData.typeData===1){
          try{
            if(!selectedImage){
              setErrorMessage('Seleccione una imagen')
              return;
            }
            setLoading(true)
            const data = { id: contentData._id, updated: selectedImage64 , category: category.name, typeData: contentData.typeData }
                  
            const response = await fetch('/api/library/category/update',{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }); 
            const respData = await response.json();
  
            if(respData.message==="success"){
              alert('Éxito el contenido se actualizó correctamente')            
            } else {
              alert('Ocurrío algún tipo de error, intente nuevamente')
            }
            
          }catch(e){
            console.log(e)
          }        
        }
  
        if(contentData.typeData===2){
          try{
            if(!plainText){
              setErrorMessage('Seleccione un archivo de texto')
              return;
            }
            setLoading(true)
            const data = { id: contentData._id, updated: plainText, category: category.name, typeData: contentData.typeData }
                  
            const response = await fetch('/api/library/category/update',{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }); 
            const respData = await response.json();
  
            if(respData.message==="success"){
              alert('Éxito el contenido se actualizó correctamente')            
            } else {
              alert('Ocurrío algún tipo de error, intente nuevamente')
            }
            
          }catch(e){
            console.log(e)
          }        
        }
        await renderData()
        setLoading(false)
        close()
      }

    return (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10" style={{zIndex: 999}}>
            <div className="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-white">
                <div className="w-full">
                <div className="m-8 my-20 max-w-[400px] mx-auto">
                    <div className="mb-8">
                        <h1 className="mb-4 text-3xl font-extrabold">{contentData.typeData===0?'Video URL':(
                                    contentData.typeData===1?'Imagen':(
                                        contentData.typeData===2?'Archivo de texto':''
                                      )
                                )}</h1>
                        {contentData.typeData === 0 &&
                            <div>
                                <input onChange={onChangeVideoURL} className="w-full text-base py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" style={{color: 'black'}} type="" placeholder="Introduce una url de un video" />
                            </div>
                        }
                        {contentData.typeData === 1 &&
                            <div>
                                <span className="mb-5" >Seleccionar imagen:</span> <br/>
                                <input type="file" id="coverInput" accept="image/*" onChange={handleImageChange} />
                                {selectedImage && (
                                    <img src={URL.createObjectURL(selectedImage)} alt="Preview" style={{ maxWidth: '100%', borderRadius: 10 }} />
                                )}
                            </div>
                        }
                        {contentData.typeData === 2 &&
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
                    <div className="space-y-4">
                    <button onClick={onSubmitContent} className="p-3 bg-black rounded-full text-white w-full font-semibold">Guardar cambios</button>
                    <button onClick={close} className="p-3 bg-white border rounded-full w-full font-semibold">Cancelar</button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default ModalCategory