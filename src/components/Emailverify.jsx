import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Emailverify() {
    const [otp,setotp]=useState('');
    const [form,setform]=useState(true);
    // const [text,setText]=useState(false);
    // const { foodname } = useContext(UserContext);
const navigate=useNavigate();


 const sendotp=localStorage.getItem('otp');
 console.log(sendotp);
 
 const check=(e)=>{
    e.preventDefault();
    
    if(otp===sendotp){
       setform(false);
      
      navigate('/');
       localStorage.removeItem('otp');
      
       
    };

    if(otp!==sendotp){
      alert("please write correct otp");
    }
    if(!sendotp){
      navigate('/signup');
   }

   
    

 }
  return (
    <div style={{width:'100vw',height:'100vh',backgroundColor:'black'}}>
        { form && <form onSubmit={check}>
        <input type='text' placeholder='To verify write the OTP' onChange={(e)=>setotp(e.target.value)}/>
         <button type='submit'>Submit</button>
         </form>}

        
    </div>
  )
}
