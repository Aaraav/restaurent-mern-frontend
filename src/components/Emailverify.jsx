import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Emailverify() {
    const [otp, setOtp] = useState('');
    const [form, setForm] = useState(true);
    const navigate = useNavigate();

    const sendOtp = localStorage.getItem('otp');
    const email = localStorage.getItem('email'); // Assuming email is also stored in localStorage
    const username = localStorage.getItem('username'); // Assuming email is also stored in localStorage
    const password = localStorage.getItem('password'); // Assuming email is also stored in localStorage

    useEffect(() => {
        if (!sendOtp) {
            navigate('/signup');
        }
    }, [sendOtp, navigate]);

    const check = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://restaurant-backend-2-mad1.onrender.com/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp,username,password }),
            });

            const data = await response.json();

            if (data.success) {
                setForm(false);

                navigate('/');
                localStorage.removeItem('otp');
                localStorage.removeItem('email');
                localStorage.removeItem('username');
                localStorage.removeItem('password'); // Clear email from localStorage if you have stored it
                // Clear email from localStorage if you have stored it
                // Clear email from localStorage if you have stored it
            } else {
                alert(data.message || "Please write the correct OTP");
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('An error occurred while verifying the OTP. Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            {form && (
                <form onSubmit={check} style={styles.form}>
                    <input
                        type='text'
                        placeholder='To verify, write the OTP'
                        onChange={(e) => setOtp(e.target.value)}
                        value={otp}
                        style={styles.input}
                    />
                    <button type='submit' style={styles.button}>Submit</button>
                </form>
            )}
        </div>
    );
}

const styles = {
    container: {
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    input: {
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: 'none',
        width: '200px',
        color:'black'
    },
    button: {
        padding: '10px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#e21837',
        color: 'white',
        cursor: 'pointer',
    }
};
