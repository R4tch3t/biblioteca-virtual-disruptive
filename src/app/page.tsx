"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Singup from "./components/singup";
import Login from "./components/login";
import { cookies } from 'next/headers'
import { useCookies } from "react-cookie";
import Boilerplate from "./components/boilerplate";

export default function Home() {
  const [cookies, setCookie, removeCookie] = useCookies(['email', 'userName', 'isReader', 'isCreator' , 'isAdmin', 'remember']);
  const [emailSession, setEmailSession] = useState('')
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState(0)
  

  const closeSession = () => {
    removeCookie('email')
    removeCookie('userName')
    removeCookie('isReader')
    removeCookie('isCreator')
    removeCookie('isAdmin')
    removeCookie('remember')
  }

  useEffect(()=>{
    setEmailSession(cookies?.email!)
    setUserName(cookies?.userName!)
    setLoading(false)
    setRole(cookies?.isAdmin?1:(cookies?.isCreator?2:(cookies?.isReader?3:0)))
  },[cookies])

  if(loading){
    return (
      <div style={{display: 'flex',flex: 1, height: 700, justifyContent: 'center', alignItems: 'center'}} >      
          Cargando...      
      </div>
    )
  }

  if(emailSession){ // User are logged
    return (
      <div>
        <div className="flex w-full justify-center items-center" >
          <h1 style={{fontSize: 32}}>Bienvenido {userName}</h1>
        </div>

        {role===1 &&
          <div style={{width: 250, position: 'absolute', left: 5, top: 40}} >
            <Link href={'library/new'}>
              <button type="submit"  className="w-full flex justify-center bg-blue-500 text-gray-100 p-4  rounded-full tracking-wide font-semibold  focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg cursor-pointer transition ease-in duration-300">Nueva categoría</button>
            </Link>
          </div>}

        <div style={{width: 250, position: 'absolute', right: 5, top: 40}} >
          <button type="submit" onClick={closeSession}  className="w-full flex justify-center bg-red-500 text-gray-100 p-4  rounded-full tracking-wide font-semibold  focus:outline-none focus:shadow-outline hover:bg-red-600 shadow-lg cursor-pointer transition ease-in duration-300">Cerrar sesión</button>
        </div>
        <div>
          <Boilerplate />
        </div>
      </div>
    )
  }

  return (
  <div className="dialog" id="dialog">
    <div className="card w-full p-0">
      <div className="card-body w-full p-0">

        <Login />             

        <div>
          <Boilerplate />
        </div> 

      </div>
    </div>
  </div>
  );
}
