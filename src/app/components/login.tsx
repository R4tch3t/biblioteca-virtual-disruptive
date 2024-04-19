import Link from "next/link"
import { ChangeEvent, FormEvent, useState } from "react";
import { useCookies } from "react-cookie";


const LoginComponent = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['email', 'userName', 
        'isReader', 'isCreator' , 'isAdmin', 'remember']);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [remember, setRemember] = useState(false)

    const onSubmitHandle = async (e: FormEvent<HTMLFormElement>) => {
        if(loading){
            return
        }
        try {
            setLoading(true)
            e.preventDefault()
            const data = {email, password}
            const response = await fetch('/api/user/exists',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }); 
            const respData = await response.json();            
            
            if(respData.exists){
                const maxAge = 600 // 10 minutes
                const options: any = {}
                if(!remember){
                    options.maxAge=maxAge
                }
                setCookie('email',email,options)
                setCookie('userName',respData.result.userName, options)
                setCookie('isReader',respData?.result?.isReader!, options)
                setCookie('isCreator',respData?.result?.isCreator!, options)
                setCookie('isAdmin',respData?.result?.isAdmin!, options)
            } 
        }catch(e){
            console.log(e)
        }
        setLoading(false)
    }

    const onChangeEmail = async (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e?.currentTarget?.value!)
    }

    const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value)
    }

    const onChangeRemember = () => {
        setRemember(!remember)
    }
    
    return (
        <div className="view login-view" style={{display: 'block'}}>
            <div className="h-auto flex justify-center mt-5">
              
              <div className="flex w-full lg:w-1/2 justify-center items-center bg-white rounded-[8px]">
                <div className="relative flex items-center">
                  <div className="w-full z-10">
                    <div className="text-center">
                      <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Bienvenido
                      </h2>
                      <p className="mt-2 text-sm text-gray-600">
                        Inicia sesión con tu usuario y contraseña
                      </p>
                    </div>
                    <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={onSubmitHandle} >
                      <input type="hidden" name="remember" value="true" />
                      <div className="relative">                        
                        <label className="text-sm font-bold text-gray-700 tracking-wide">Correo</label>
                        <input onChange={onChangeEmail} className="w-full text-base py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" style={{color: 'black'}} type="" placeholder="mail@gmail.com" />
                      </div>
                      <div className="mt-8 content-center">
                        <label className="text-sm font-bold text-gray-700 tracking-wide">Contraseña</label>
                        <input onChange={onChangePassword} className="w-full content-center text-base py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" style={{color: 'black'}} type="password" placeholder="Ingresa tu contraseña" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input onChange={onChangeRemember} checked={remember} id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 bg-indigo-500 focus:ring-indigo-400 border-gray-300 rounded" />
                          <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">Recordarme</label>
                        </div>
                        <div className="text-sm">
                          <Link href={'/user/recovery'} className="font-medium text-indigo-500 hover:text-indigo-500">Recuperar contraseña</Link>
                        </div>
                      </div>
                      <div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center bg-indigo-500 text-gray-100 p-4  rounded-full tracking-wide font-semibold  focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg cursor-pointer transition ease-in duration-300">
                            {!loading?'Iniciar sesión':'Iniciando...'}
                        </button>
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

export default LoginComponent