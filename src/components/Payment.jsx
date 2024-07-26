import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContextProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

export default function Payment() {
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const { total, settotal, foodname, setfoodname } = useContext(UserContext);
    const navigate = useNavigate();

    // Retrieve foodname and total from localStorage on component mount
    useEffect(() => {
        const savedFoodname = JSON.parse(localStorage.getItem('foodname'));
        const savedTotal = JSON.parse(localStorage.getItem('total'));
        if (savedFoodname) {
            setfoodname(savedFoodname);
        }
        if (savedTotal) {
            settotal(savedTotal);
        }
    }, [setfoodname, settotal]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({ cardNumber, cardHolder, expiryDate, cvv });

        alert('Thanks for ordering!');
        const username = localStorage.getItem('username');
        const response = await axios.post('https://restaurant-backend-2-mad1.onrender.com/setorder', {
            foodname,
            username,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response.data.order._id);
        localStorage.setItem('orderid', response.data.order._id);
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Latitude:', position.coords.latitude);
                localStorage.setItem('Latitude:', position.coords.latitude);
                console.log('Longitude:', position.coords.longitude);
                localStorage.setItem('Longitude:', position.coords.longitude);
            },
            (error) => {
                console.log('Error:', error);
            }
        );

        navigate('/tracking');
    };

    return (
        <>
            <Header />
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: 'black',
                }}
            >
                <form
                    onSubmit={handleSubmit}
                    style={{
                        width: '400px',
                        padding: '20px',
                        borderRadius: '10px',
                        backgroundColor: 'black',
                        border: '2px solid #E21837', // Red border
                        boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)', // Red shadow
                    }}
                >
                    <h2
                        style={{
                            color: '#E21837',
                            textAlign: 'center',
                            marginBottom: '20px',
                            borderBottom: '2px solid #E21837',
                            paddingBottom: '10px',
                        }}
                    >
                        Payment
                    </h2>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#E21837' }}>
                            Card Number
                        </label>
                        <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #E21837',
                                outline: 'none',
                                backgroundColor: 'black',
                                color: 'white',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#E21837' }}>
                            Card Holder
                        </label>
                        <input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #E21837',
                                outline: 'none',
                                backgroundColor: 'black',
                                color: 'white',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <div style={{ width: '48%' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: '#E21837' }}>
                                Expiry Date
                            </label>
                            <input
                                type="text"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '1px solid #E21837',
                                    outline: 'none',
                                    backgroundColor: 'black',
                                    color: 'white',
                                }}
                                placeholder="MM/YY"
                            />
                        </div>

                        <div style={{ width: '48%' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: '#E21837' }}>
                                CVV
                            </label>
                            <input
                                type="number"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '1px solid #E21837',
                                    outline: 'none',
                                    backgroundColor: 'black',
                                    color: 'white',
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '5px',
                            border: 'none',
                            backgroundColor: '#E21837', // Red background
                            color: 'white',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                        }}
                    >
                        Submit Payment
                    </button>
                </form>

                <div
                    style={{
                        marginLeft: '40px',
                        width: '300px',
                        backgroundColor: '#E21837', // Red background
                        height: 'auto',
                        borderRadius: '30px',
                        padding: '15px',
                        color: 'white',
                    }}
                >
                    <h1 style={{ color: 'black' }}>₹{total}</h1>
                    <ul style={{ padding: '0', margin: '0' }}>
                        {foodname.map((item, index) => (
                            <li key={index} style={{ color: 'black', listStyle: 'none', padding: '5px 0' }}>
                                {item.description} - {item.quantity}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
