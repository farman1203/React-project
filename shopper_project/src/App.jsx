import React from 'react'
import Header from './Website/Component/Header'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from './Website/Component/Footer'
import Index from './Website/Pages/Index'
import About from './Website/Pages/About'
import Shop from './Website/Pages/Shop'
import Shop_single from './Website/Pages/Shop_single'
import Cart from './Website/Pages/Cart'
import Checkout from './Website/Pages/Checkout'
import Contact from './Website/Pages/Contact'
import Alogin from './Admin/Pages/Alogin'
import Login from './Website/Pages/Login'
import Dashboard from './Admin/Pages/Dashboard'
import Thankyou from './Website/Pages/Thankyou'
import Pagenote404 from './Website/Pages/Pagenote404'
import UBefore_login from './Website/Pages/UBefore_login'
import UAfter_login from './Website/Pages/UAfter_login'
import User_profile from './Website/Pages/User_profile'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Edit_product from './Admin/Pages/Edit_product'

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <ToastContainer ></ToastContainer>
        <Routes>
          <Route path="/" element={<><Header /><Index /><Footer /></>}></Route>
          <Route path="/about" element={<><Header /><About /><Footer /></>}></Route>
          <Route path="/shop" element={<><Header /><Shop /><Footer /></>}></Route>
          <Route path="/shop-single/:id" element={<><Header /><Shop_single /><Footer /></>}></Route>
          <Route path="/cart" element={<><Header /><Cart /><Footer /></>}></Route>
          <Route path="/checkout" element={<><Header /><Checkout /><Footer /></>}></Route>
          <Route path="/contact" element={<><Header /><Contact /><Footer /></>}></Route>
          <Route path="/thankyou" element={<><Header /><Thankyou /><Footer /></>}></Route>
          <Route path="*" element={<><Header /><Pagenote404 /><Footer /></>}></Route>

          <Route element={<UBefore_login />}>
            <Route path="/login" element={<><Header/><Login /></>}></Route>
          </Route>

          <Route element={<UAfter_login />}>
            <Route path="/user_profile" element={<><Header /><User_profile /><Footer /></>}></Route>
          </Route>


          <Route path="/alogin" element={<><Alogin /></>}></Route>
          {/* <Route path="/edit_product/" element={<><Edit_product /></>}></Route> */}
          {/* <Route path="/dashboard" element={<><Dashboard/></>}></Route> */} 


        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
