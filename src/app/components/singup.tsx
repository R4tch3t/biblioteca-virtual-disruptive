import Link from "next/link"
import { ChangeEvent, FormEvent, useState } from "react"
import Error from "./icons/error"
import Success from "./icons/success"

const SignUpComponent = () => {
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
        e.preventDefault()
        if(loading){
            return
        }
        try {

            setLoading(true)
            if(!userName||errorUserName){
                setErrorMessage('Corrige tu nombre de usuario, no puede quedar en blanco.')
                setErrorUserName(true)
                return
            }

            try{
                // Checking if email data already exists
                let data:any = {email}
                let response: any = await fetch('/api/user/exists',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }); 
                let respData:any = await response.json();            
                
                if(respData.exists){
                    setErrorMessage('El correo ya fue registrado.')
                    setErrorEmail(true)
                    return
                }
                // Checking if userName data already exists
                data = {userName}
                response = await fetch('/api/user/exists',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }); 
                respData = await response.json();                            
                if(respData.exists){
                    setErrorMessage('El nombre de usuario ya fue registrado.')
                    setErrorUserName(true)
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

            if(!isReader&&!isCreator&&!isAdmin){
                setErrorMessage('Selecciona el tipo de usuario.')
                setErrorCheckBox(true)
                return
            }

            setErrorMessage('')

            const data = {userName,email,password,isReader,isCreator,isAdmin}
            const response = await fetch('/api/user/new',{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              }); 
            const respData = await response.json();            
            if(respData.message==="success"){
                alert('Éxito el usuario se registró correctamente')
            } else {
                alert('Ocurrío algún tipo de error, intente nuevamente')
            }
          } catch (error) {
            console.error('Error al obtener usuarios:', error);
          }
          setLoading(false)
    }

    const onChangeUserName = (e: ChangeEvent<HTMLInputElement>) => {
        let validate:any = e.currentTarget.value
        if(validate){
            setErrorUserName(false)
            setErrorMessage('')
        }else{
            setErrorUserName(true)
        }
        setUserName(e.currentTarget.value)
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

    const onChangeIsReader = (e: ChangeEvent<HTMLInputElement>) => {        
        setIsCreator(isReader)
        setIsReader(!isReader)
        setIsAdmin(false)
        setErrorCheckBox(false)
        setErrorMessage('')
    }

    const onChangeIsCreator = (e: ChangeEvent<HTMLInputElement>) => {        
        setIsReader(isCreator)
        setIsCreator(!isCreator)
        setIsAdmin(false)
        setErrorCheckBox(false)
        setErrorMessage('')
    }

    // Only for add admin users is disabled by default, only enable in case of added more administrator locally
    const onChangeIsAdmin = (e: ChangeEvent<HTMLInputElement>) => {        
        setIsReader(isAdmin)
        setIsAdmin(!isAdmin)
        setErrorCheckBox(false)
    }

    

    return (
        <div className="view login-view" style={{display: 'block'}}>
            <div className="h-auto flex justify-center mt-5">
              
              <div className="flex w-full lg:w-1/2 justify-center items-center bg-white rounded-[8px]">
                <div className="relative flex items-center">
                  <div className="w-full z-10">
                    <div className="text-center">
                      <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Registrarse
                      </h2>
                      <p className="mt-2 text-sm text-gray-600">
                        Crea un cuenta con tu correo y una contraseña
                      </p>
                    </div>
                    <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={onSubmitHandle}>
                      <input type="hidden" name="remember" value="true" />
                      <div className="mt-8 content-center">
                        {errorUserName &&
                            <Error />    
                        }

                        {errorUserName === false &&
                            <Success />    
                        }
                        <label className="text-sm font-bold text-gray-700 tracking-wide">Nombre de usuario</label>
                        <input onChange={onChangeUserName} className="w-full content-center text-base py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" style={{color: 'black'}} type="" placeholder="Ingresa tu alias" />
                      </div>
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
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                            <input onChange={onChangeIsReader} id="isReader" name="isReader" type="checkbox" checked={isReader} className="h-4 w-4 bg-indigo-500 focus:ring-indigo-400 border-gray-300 rounded" />
                            <label  className="ml-2 block text-sm text-gray-900">Lector</label>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                            <input onChange={onChangeIsCreator} id="isCreator" name="isCreator" type="checkbox" checked={isCreator} className="h-4 w-4 bg-indigo-500 focus:ring-indigo-400 border-gray-300 rounded" />
                            <label  className="ml-2 block text-sm text-gray-900">Creador</label>
                            </div>
                        </div>
                        {/* Enable for add more admins*/}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                <input onChange={onChangeIsAdmin} id="isCreator" name="isCreator" type="checkbox" checked={isAdmin} className="h-4 w-4 bg-indigo-500 focus:ring-indigo-400 border-gray-300 rounded" />
                                <label  className="ml-2 block text-sm text-gray-900">Administrador</label>
                                </div>
                            </div>
                      </div>
                      
                      {errorMessage && 
                        <div style={{maxWidth: 500}}>
                          <span className="text-red-500"  >{errorMessage}</span> 
                        </div>
                      }
                      
                      <div>
                        <button type="submit"  className="w-full flex justify-center bg-indigo-500 text-gray-100 p-4  rounded-full tracking-wide font-semibold  focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg cursor-pointer transition ease-in duration-300">Registrarse</button>
                      </div>
                      <p className="flex flex-col items-center justify-center mt-10 text-center text-md text-gray-500">
                        <span>¿Ya tienes cuenta?</span>
                        <Link href={'/'} className="text-indigo-500 hover:text-indigo-500no-underline hover:underline cursor-pointer transition ease-in duration-300">Iniciar sesión</Link>
                      </p>
                    </form>
                  </div>
                </div>
              </div>

            </div>
          </div>
    )
}

export default SignUpComponent