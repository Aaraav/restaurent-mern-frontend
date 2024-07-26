import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
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
import { io } from 'socket.io-client';
import Header from './components/Header';

function App() {
  const scrollRef = useRef(null);
  const [notification, setNotification] = useState(null);
  const username = localStorage.getItem('username');

  return (
    <>
      {notification && (
        <div style={{ position: 'fixed', top: 0, right: 0, backgroundColor: 'red', color: 'white', padding: '10px' }}>
          <strong>{notification.sender}:</strong> {notification.message}
        </div>
      )}
      <Router>
        <div ref={scrollRef} className="App">
          {/* {username && !(window.location.pathname === '/signup' || window.location.pathname === '/login') && <Header />} */}
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/uploadmenu" element={<Uploadmenu />} />
            <Route path="/" element={<Done />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/email" element={<Emailverify />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/allorders" element={<Allorder />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/list" element={<Userslist />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;