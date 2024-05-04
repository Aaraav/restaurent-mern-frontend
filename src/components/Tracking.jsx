import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GoogleMap from './GoogleMap';
import { useNavigate } from 'react-router-dom';

export default function Tracking() {
    const lat = localStorage.getItem('Latitude:');
    const long = localStorage.getItem('Longitude:');
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState('pending');
    const [visible, setVisible] = useState(false);
    const id = localStorage.getItem('orderid');
    const [reason, setReason] = useState(localStorage.getItem('reason') || '');
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=1f1faeb0cf9e49999de1fc29b4128294`);
            console.log(response.data.results[0].formatted);
            setAddress(response.data.results[0].formatted);
        };

        const fetchOrder = async () => {
            const response = await axios.get(`https://restaurant-backend-q89z.onrender.com/getorder/${id}`);
            setStatus(response.data.status);
            // Set visibility of reason based on status
            setVisible(response.data.status === 'Cancelled');
        };

        fetchOrder();

        if (status === ('Fulfilled')) {
            alert('Your order is fulfilled');
            setTimeout(() => {
                navigate('/');
            }, 3000);
        }

        if (status === ('Cancelled')) {
          alert('Your order is Cancelled');
          setTimeout(() => {
              navigate('/menu');
          }, 3000);
      }
        fetch();
    }, [id, lat, long, navigate, status]);

    return (
        <div style={{ backgroundColor: 'black', width: '100vw', height: '100vh' }}>
            <h1 style={{ color: 'white' }}>{address}</h1>

            <GoogleMap />

            <h1 style={{ color: 'white', marginLeft: '55vw', position: 'absolute', top: '40%' }}>
                Status of your order is {status}
            </h1>

            {visible && (
                <h1 style={{ color: 'red', marginLeft: '50vw', position: 'absolute', top: '50%' }}>
                    Reason for cancellation: {reason}
                </h1>
            )}
        </div>
    );
}
