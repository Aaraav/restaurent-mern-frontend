import React, { useEffect, useRef,useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // Import your global styles
import Signup from './components/Signup';
import Login from './components/Login';
import Done from './components/Done';
import LocomotiveScroll from 'locomotive-scroll';
import Uploadmenu from './components/Uploadmenu';
import Menu from './components/Menu';
import Cart from './Cart';
import Confirmation from './components/Confirmation';
import Payment from './components/Payment';
import Emailverify from './components/Emailverify';
import Tracking from './components/Tracking';
import Allorder from './components/Allorder';
import Contact from './components/Contact';
import Userslist from './components/Userslist';
import axios from 'axios';
function App() {
  const scrollRef = useRef(null);

  useEffect(() => {

    // const scroll = new LocomotiveScroll({
    //   el: scrollRef.current,
    //   smooth: true, // Enable smooth scrolling
    //   // Add more options as needed
    // });

    // return () => {
    //   if (scroll) {
    //     scroll.destroy();
    //   }
    // };
  }, []);

  
  return (
    <Router>
      <div
        ref={scrollRef}
        // data-scroll-container
        className="App" // Set the class name for global styles
      >
        {/* <Header/> */}
        <Routes>
  <Route path="/signup" element={<Signup />} />
  <Route path="/login" element={<Login />} />
   {/* Render Cart before Menu */}
  <Route path='/menu' element={<Menu/>}/> {/* Render Menu after Cart */}
  <Route path='/cart' element={<Cart/>}/>
  <Route path='/uploadmenu' element={<Uploadmenu/>}/>
  <Route path='/' element={<Done/>}/>
  <Route path='/confirmation' element={<Confirmation/>}/>
  <Route path='/payment' element={<Payment/>}/>
  <Route path='/email' element={<Emailverify/>}/>
  <Route path='/tracking' element={<Tracking/>}/>
<Route path='/allorders' element={<Allorder/>}/>
<Route path='/contact' element={<Contact/>}/>
{/* <Route path="/contact/:chatPartners" component={<Contact/>} /> */}
<Route path='/list' element={<Userslist/>}/>

  {/* Add more routes as needed */}
  {/* For example: <Route path="/dashboard" element={<Dashboard />} /> */}
</Routes>
       
      </div>
    </Router>
  );
}

export default App;



