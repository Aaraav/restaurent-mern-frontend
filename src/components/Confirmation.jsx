import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContextProvider';
import { useNavigate } from 'react-router-dom';
 import Header from './Header';
//  import io from 'socket.io-client';

export default function Confirmation() {
  const [otp, setOtp] = useState('');
  const [form, setForm] = useState(true);
  const [text, setText] = useState(false);
  const { foodname,setclients,clients } = useContext(UserContext);
  const navigate = useNavigate();
  localStorage.removeItem('orderid');
  // const socket = io('http://localhost:1000', {transports: ['websocket']});
console.log(clients);
  // useEffect(() => {
  //   socket.on("connect", (socket) => {
  //     console.log("Connected to server");
  //     // console.log(socket.id);
  //     // socket.emit('foodname', { username: localStorage.getItem('username'), foodname });
  //   });
  
  //   socket.on('message', (message) => {
  //     socket.emit('foodname', { username: localStorage.getItem('username'), foodname ,name:'aar',orderid:localStorage.getItem('orderid')});
  //   });

  //   socket.on('food',(username,foodname)=>{
  //     console.log(username);
  //     setclients(username);
  //   })
  
  //   // socket.on('connect_error', (error) => {
  //   //   console.error("Error connecting to server:", error);
  //   // });
  
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);
  

  const check = (e) => {
    e.preventDefault();
    if (otp === localStorage.getItem('otp')) {
      setForm(false);
      setText(true);
      localStorage.removeItem('otp');
      setTimeout(() => {
        navigate('/payment');
      }, 6000);
    } else if (!localStorage.getItem('otp')) {
      navigate('/menu');
    }
  };

  return (
    <>
      <Header />
      <div style={{ width: '100vw', height: '100vh', backgroundColor: 'black' }}>
        {form && (
          <form onSubmit={check}>
            <input
              type='text'
              placeholder='To confirm order write the OTP'
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
            />
            <button type='submit'>Submit</button>
          </form>
        )}

        {text && (
          <>
            <h1 style={{ color: 'white' }}>
              Your order of {foodname.map((item) => item.description).join(', ')} is confirmed
            </h1>
            <button onClick={() => navigate('/payment')}>Payment</button>
          </>
        )}
      </div>
    </>
  );
}