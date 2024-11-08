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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
        <p className="mt-4 text-white"> Loading...</p>
      </div>
        // 'loading'
    )
}

export default App
