import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Searchbar from './components/SearchBar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from './pages/ResetPassword'

const App = () => {
  return (
    <div className='min-h-screen overflow-x-hidden px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12'>
       <ToastContainer />
      <Navbar/>
      <Searchbar/>
      <Routes>
       <Route path='/' element={<Home/>} /> 
       <Route path='/collection' element={<Collection/>}/>
       <Route path='/about' element={<About/>}/>
       <Route path='/contact' element={<Contact/>} />
       <Route path='/product/:productId' element={<Product/>} />
       <Route path='/cart' element={<Cart/>}/>
       <Route path='/login' element={<Login/>}/>
      <Route path="/reset-password/:token" element={<ResetPassword />} />
       <Route path='/place-order' element={<PlaceOrder/>}/>
       <Route path='/orders' element={<Orders/>}/>
      </Routes>
      <Footer/>
      </div>
  )
}

export default App