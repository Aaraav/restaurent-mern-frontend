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
                    minHeight: '100vh', // Ensures the container fills the viewport height
                    width: '100vw',
                    backgroundColor: '#121212', // Darker background
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: '20px', // Padding to ensure content is not touching the edges
                }}
            >
                {formVisible && (
                    <form
                        onSubmit={handleCheckOtp}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '15px', // Increased gap for better spacing
                            backgroundColor: '#1e1e1e', // Slightly lighter dark background
                            padding: '30px', // More padding
                            borderRadius: '15px', // More rounded corners
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Box shadow for depth
                            animation: 'fadeIn 1s', // Simple fade-in animation
                            maxWidth: '400px', // Limit form width
                            width: '100%', // Ensure the form takes full width up to the max-width
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Enter OTP from your email"
                            onChange={(e) => setOtp(e.target.value)}
                            value={otp}
                            style={{
                                padding: '12px',
                                borderRadius: '5px',
                                border: '1px solid #E21837', // Red border
                                backgroundColor: 'black',
                                color: 'white',
                                width: '100%', // Ensure input takes full width of the form
                                transition: 'border-color 0.3s', // Smooth transition for border
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#ff7675'} // Change border color on focus
                            onBlur={(e) => e.target.style.borderColor = '#f56565'} // Revert border color on blur
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '12px 25px',
                                backgroundColor: '#E21837', // Red button
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                width: '100%', // Ensure button takes full width of the form
                                transition: 'background-color 0.3s', // Smooth transition for background color
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#ff7675'} // Lighter red on hover
                            onMouseOut={(e) => e.target.style.backgroundColor = '#f56565'} // Revert on mouse out
                        >
                            Submit
                        </button>
                    </form>
                )}

                {orderConfirmed && (
                    <div style={{ textAlign: 'center', color: 'white', animation: 'fadeIn 1s', maxWidth: '600px', width: '100%', padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                        <h1>Your order of {foodname.map((item) => item.description).join(', ')} is confirmed!</h1>
                        <button
                            onClick={() => navigate('/payment')}
                            style={{
                                padding: '12px 25px',
                                backgroundColor: '#E21837', // Red button
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginTop: '15px', // Increased margin-top for spacing
                                transition: 'background-color 0.3s', // Smooth transition for background color
                                width: '100%', // Ensure button takes full width
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#ff7675'} // Lighter red on hover
                            onMouseOut={(e) => e.target.style.backgroundColor = '#f56565'} // Revert on mouse out
                        >
                            Proceed to Payment
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

// CSS for animations (can be added to a CSS file or a <style> block)
const styles = `
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
`;

// Append the styles to the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
