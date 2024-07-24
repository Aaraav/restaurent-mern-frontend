import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContextProvider';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

export default function Confirmation() {
    const [otp, setOtp] = useState('');
    const [formVisible, setFormVisible] = useState(true);
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const { foodname } = useContext(UserContext);
    const navigate = useNavigate();

    const handleCheckOtp = (e) => {
        e.preventDefault();
        const storedOtp = localStorage.getItem('otp');
        if (otp === storedOtp) {
            setFormVisible(false);
            setOrderConfirmed(true);
            localStorage.removeItem('otp');

            // Redirect to payment page after 6 seconds
            setTimeout(() => {
                navigate('/payment');
            }, 6000);
        } else if (!storedOtp) {
            navigate('/menu');
        }
    };

    return (
        <>
            <Header />
            <div
                style={{
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'black',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                {formVisible && (
                    <form
                        onSubmit={handleCheckOtp}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px',
                            backgroundColor: '#1a1a1a', // Dark gray background
                            padding: '20px',
                            borderRadius: '10px',
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Enter OTP from your email"
                            onChange={(e) => setOtp(e.target.value)}
                            value={otp}
                            style={{
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #f56565', // Red border
                                backgroundColor: 'black',
                                color: 'white',
                                width: '200px',
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#f56565', // Red button
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Submit
                        </button>
                    </form>
                )}

                {orderConfirmed && (
                    <div style={{ textAlign: 'center', color: 'white' }}>
                        <h1>Your order of {foodname.map((item) => item.description).join(', ')} is confirmed!</h1>
                        <button
                            onClick={() => navigate('/payment')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#f56565', // Red button
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginTop: '10px',
                            }}
                        >
                            Proceed to Payment
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
