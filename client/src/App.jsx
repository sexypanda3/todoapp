import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Auth from './helpers/auth'
import './App.css'
import Signin from './views/Signin'
import Signup from './views/Signup'
import Home from './views/Home'
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient()

function App() {


  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <Routes>
          {
            Auth.isAuthenticated() ? (
              <>
                <Route path='*' element={<Home />} />
              </>
            )
              : (
                <>
                  <Route path='/signin' element={<Signin />} />
                  <Route path='/signup' element={<Signup />} />
                  <Route path='*' element={<Signin />} />
                </>
              )

          }
        </Routes>
        <Toaster />
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App