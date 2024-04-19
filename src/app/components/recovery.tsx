import Link from "next/link"
import { ChangeEvent, FormEvent, useState } from "react"
import Error from "./icons/error"
import Success from "./icons/success"

const RecoveryComponent = () => {
    const [errorUserName, setErrorUserName]:[boolean|undefined, any] = useState()
    const [errorEmail, setErrorEmail]:[boolean|undefined, any] = useState()
    const [errorPassword, setErrorPassword]:[boolean|undefined, any] = useState()
    const [errorCheckBox, setErrorCheckBox]:[boolean|undefined, any] = useState()
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isReader, setIsReader] = useState(false)
    const [isCreator, setIsCreator] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)

    //First function, for submit form after validate all data
    const onSubmitHandle = async (e: FormEvent<HTMLFormElement>) => {
        if(loading){
            return
        }
        try {
            setLoading(true)
            e.preventDefault()
            

            try{
                // Checking if email data already exists
                const data = {email}
                const response = await fetch('/api/user/exists',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }); 
                const respData = await response.json();            
                
                if(!respData.exists){
                    setErrorMessage('Error: verifíca los datos.')
                    setErrorEmail(true)
                    return
                } 
            }catch(e){
                console.log(e)
            }

            if(!email||errorEmail){
                setErrorMessage('Corrige tu correo, no puede quedar en blanco y debe tener el formato correcto.')
                setErrorEmail(true)
                return
            }

            if(!password||!confirmPassword||errorPassword){
                setErrorMessage('Las contraseñas no coinciden o están en blanco.')
                setErrorPassword(true)
                return
            }

            setErrorMessage('')

            const data = {email,updated: {password}}
            const response = await fetch('/api/user/recovery',{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              }); 
            const respData = await response.json();            
            if(respData.message==="success"){
                alert('Éxito el usuario se recupero correctamente')
            } else {
                alert('Ocurrío algún tipo de error, intente nuevamente')
            }
          } catch (error) {
            console.error('Error al obtener usuarios:', error);
          }
          setLoading(false)
    }

    const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
        let validate:any = e?.currentTarget?.value?.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{1,4}$/i);        

        if(validate){
            setErrorEmail(false)
            setErrorMessage('')
        }else{
            setErrorEmail(true)
        }
        setEmail(e?.currentTarget?.value!)
    }

    const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
        let validate:any = e.currentTarget.value===confirmPassword
        if(validate){
            setErrorPassword(false)
            setErrorMessage('')
        }else{
            setErrorPassword(true)
        }
        setPassword(e.currentTarget.value)
    }

    const onChangeConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
        let validate:any = e.currentTarget.value===password
        if(validate){
            setErrorPassword(false)
            setErrorMessage('')
        }else{
            setErrorPassword(true)
        }
        setConfirmPassword(e.currentTarget.value)
    }

    

    return (
        <div className="view login-view" style={{display: 'block'}}>
            <div className="h-auto flex justify-center mt-5">
              
              <div className="flex w-full lg:w-1/2 justify-center items-center bg-white rounded-[8px]">
                <div className="relative flex items-center">
                  <div className="w-full z-10">
                    <div className="text-center">
                      <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Recuperar contraseña
                      </h2>
                      <p className="mt-2 text-sm text-gray-600">
                        Introduce los siguientes datos para cambiar tu contraseña
                      </p>
                    </div>
                    <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={onSubmitHandle}>
                      <input type="hidden" name="remember" value="true" />
                      
                      <div className="relative">
                        
                        {errorEmail &&
                            <Error />    
                        }

                        {errorEmail === false &&
                            <Success />    
                        }
                        
                        <label className="text-sm font-bold text-gray-700 tracking-wide">Correo</label>
                        <input onChange={onChangeEmail}  className="w-full text-base py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" style={{color: 'black'}} type="" placeholder="mail@gmail.com" />
                      </div>
                      <div className="mt-8 content-center">
                        <label className="text-sm font-bold text-gray-700 tracking-wide">Contraseña</label>
                        <input onChange={onChangePassword} className="w-full content-center text-base py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" style={{color: 'black'}} type="password" placeholder="Ingresa tu contraseña" />
                      </div>
                      <div className="mt-8 content-center">
                        {errorPassword &&
                            <Error />    
                        }

                        {errorPassword === false &&
                            <Success />    
                        }
                        <label className="text-sm font-bold text-gray-700 tracking-wide">Confirmar contraseña</label>
                        <input onChange={onChangeConfirmPassword} className="w-full content-center text-base py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" style={{color: 'black'}} type="password" placeholder="Confirma tu contraseña" />
                      </div>
                      <div>
                        {errorCheckBox &&
                            <Error />    
                        }

                        {errorCheckBox === false &&
                            <Success />    
                        }
                        
                        
                      </div>
                      
                      {errorMessage && 
                        <div style={{maxWidth: 500}}>
                          <span className="text-red-500"  >{errorMessage}</span> 
                        </div>
                      }
                      
                      <div>
                        <button type="submit"  className="w-full flex justify-center bg-indigo-500 text-gray-100 p-4  rounded-full tracking-wide font-semibold  focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg cursor-pointer transition ease-in duration-300">Actualizar contraseña</button>
                      </div>
                      <p className="flex flex-col items-center justify-center mt-10 text-center text-md text-gray-500">
                        <span>¿No tienes cuenta?</span>
                        <Link href={'/user/new'} className="text-indigo-500 hover:text-indigo-500no-underline hover:underline cursor-pointer transition ease-in duration-300">Registrarme</Link>
                      </p>
                    </form>
                  </div>
                </div>
              </div>

            </div>
          </div>
    )
}

export default RecoveryComponent