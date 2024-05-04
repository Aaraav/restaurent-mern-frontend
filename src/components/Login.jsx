import React, { useState } from 'react';
import './Signup.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setLoading(true); // Start loading

        try {
            const response = await axios.post('https://restaurant-backend-q89z.onrender.com/login', {
                username: username,
                password: password
            });

            if (response.data.token) {
                // Store the token in localStorage for future use (optional)
                localStorage.setItem('token', response.data.token);

                // Redirect to '/' route upon successful login
                navigate('/');
            }
        } catch (error) {
            console.error('Error sending data:', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div>
            <div className='signup'>
                <h2>Login</h2>

                <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='username'
                />

                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='password'
                />

                {/* Show the loader while loading */}
                {loading ? (
                    <div className='loader'>Loading...</div> // Customize the loader style in your CSS
                ) : (
                    <button type='submit' onClick={handleSubmit}>Submit</button>
                )}
                
                <h3 style={{ color: 'white' }}>
                    Haven't signed up yet? <span onClick={() => navigate('/signup')}>Sign Up</span>
                </h3>
            </div>
        </div>
    );
}
