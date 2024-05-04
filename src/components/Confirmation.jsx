import React, { useEffect, useState,useContext } from 'react'
import { UserContext } from '../UserContextProvider';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
export default function Confirmation() {
    const [otp,setotp]=useState('');
    const [form,setform]=useState(true);
    const [text,setText]=useState(false);
    const { foodname } = useContext(UserContext);
const navigate=useNavigate();


 const sendotp=localStorage.getItem('otp');
 
 const check=(e)=>{
    e.preventDefault();
    
    if(otp==sendotp){
       setform(false);
       setText(true);
       localStorage.removeItem('otp');
       setTimeout(() => {
        navigate('/payment');
       }, 6000);
    };

    if(!sendotp){
        navigate('/menu');
     }
    

 }
  return (
    <>
    <Header/>
    <div style={{width:'100vw',height:'100vh',backgroundColor:'black'}}>
        { form && <form onSubmit={check}>
        <input type='text' placeholder='To confirm order write the OTP' onChange={(e)=>setotp(e.target.value)}/>
         <button type='submit'>Submit</button>
         </form>}

         {text && (
          <>
  <h1 style={{ color: 'white' }}>
    Your order of {foodname.map((item, index) => item.description)} is confirmed
  </h1>

  <button onClick={()=>navigate('/payment')}>Payment</button>
  </>
)}

    </div>
    </>
  )
}
