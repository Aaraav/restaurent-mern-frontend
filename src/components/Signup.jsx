import React, { useState } from 'react';
import axios from 'axios';
import './Signup.scss';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@nextui-org/react';
function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Correcting the naming to 'navigate'
    const [loading, setLoading] = useState(false); // Loading state


    const handleSubmit = async () => {
        setLoading(true); // Start loading

        try {
            const response = await axios.post('https://restaurant-backend-2-mad1.onrender.com/signup', {
                username,
                email,
                password
            });
            localStorage.setItem('otp', response.data.otp);
            localStorage.setItem('username',username);
            localStorage.setItem('email',email);
            localStorage.setItem('password',password);

            console.log(response.data);
            navigate('/email'); // Correctly calling navigate function
        } catch (error) {
            console.error('Error sending data:', error);
        }
    };

    return (
        <div className='signup'>
            <h2>Sign up</h2>
            <input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='username'
                id='inp'
            />
            <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='email'
                id='inp'

            />
            <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='password'
                id='inp'

            />
 {loading ? (
                    <div style={{position:'absolute', top:'20%',width:'100px'}}><Spinner/></div> // Customize the loader style in your CSS
                ) : (
                    <button  id='btnn' type='submit' onClick={handleSubmit}>Submit</button>
                )}            <h3 style={{color:'white'}}>already have an account <span style={{color:'#FA7727'}} onClick={()=>navigate('/login')}>Login</span> </h3>
        </div>
    );
}

export default Signup;
