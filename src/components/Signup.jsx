import React, { useState } from 'react';
import axios from 'axios';
import './Signup.scss';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Correcting the naming to 'navigate'
    

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:9000/signup', {
                username,
                email,
                password
            });
            localStorage.setItem('otp', response.data.otp);
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
            />
            <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='email'
            />
            <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='password'
            />
            <button type='button' onClick={handleSubmit}>Submit</button> {/* Changed type to 'button' */}
            <h3 style={{color:'white'}}>already have an account <span onClick={()=>navigate('/login')}>Login</span> </h3>
        </div>
    );
}

export default Signup;
