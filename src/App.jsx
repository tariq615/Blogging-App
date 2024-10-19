import React, { useEffect, useState } from "react"
import authService from "./appwrite/auth"
import {login, logout} from "./store/authSlice"
import { useDispatch } from "react-redux"
import { Footer, Header } from "./components"
import { Outlet } from "react-router-dom"

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData)=>{
      if (userData) {
        dispatch(login({userData}))
      } else{
        dispatch(logout())
      }
    })
    .catch((error)=>{
      console.log(error);
    })
    .finally(()=> setLoading(false))
  }, [])
  
  
  return !loading ? (<div className="min-h-screen w-full flex flex-wrap content-between bg-white ">
    <div className="w-full block">
    <Header />
    <main>
    <Outlet/>
    <Footer />
    </main>
    </div>
  </div>) : (
        <div className="flex items-center justify-center h-screen">
            <div className="relative flex flex-col items-center">
                <h1 className="-mt-4 text-xl font-bold text-gray-700">Loading...</h1>
            </div>
        </div>
        // 'loading'
    )
}

export default App
