import React, {useState, useEffect} from 'react'
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
import Profile from './pages/Profile'
import WishList from './pages/WishList'


const App = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

 useEffect(() => {
  const handleBeforeInstallPrompt = (e) => {
    console.log("beforeinstallprompt event fired ✅");
    e.preventDefault(); 
    setDeferredPrompt(e);
    setShowInstallButton(true);
  };

  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

  return () => {
    window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  };
}, []);


  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the install prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log("User choice:", outcome);
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  return (
    <div className='min-h-screen overflow-x-hidden px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12'>
      {deferredPrompt && (
        <button className='p-2 ' onClick={handleInstallClick}>Install App</button>
      )}
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
       <Route path='/profile' element={<Profile/>} />
       <Route path='/wishlist' element={<WishList/>}/>
      </Routes>
      <Footer/>
      </div>
  )
}

export default App