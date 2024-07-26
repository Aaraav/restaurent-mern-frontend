import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GoogleMap from './GoogleMap';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Header from './Header';

export default function Tracking() {
    const lat = localStorage.getItem('Latitude:');
    const long = localStorage.getItem('Longitude:');
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState('pending');
    const [visible, setVisible] = useState(false);
    const id = localStorage.getItem('orderid');
    const [reason, setReason] = useState(localStorage.getItem('reason') || '');
    const navigate = useNavigate();
    const foodname = localStorage.getItem('foodname');

    useEffect(() => {
        const socket = io('https://restaurant-backend-4-yqs6.onrender.com', { transports: ['websocket'] });
        console.log("socket", socket.id);
        socket.on("connect", () => {
            console.log("Connected to server");
            console.log("Socket ID:", socket.id);
        });
        socket.on('message', (message) => {
            socket.emit('foodname', { username: localStorage.getItem('username'), foodname, name: 'aar', orderid: localStorage.getItem('orderid') });
        });

        socket.on('stat', (data) => {
            console.log('Received data from server:', data);
            console.log('Received globalStatus:', data.globalStatus);
            setStatus(data.globalStatus);
            setReason(data.reason || "");
        });

        return () => {
            socket.disconnect();
            socket.off("connect");
            socket.off("stat");
        };
    }, []);

    useEffect(() => {
        const fetch = async () => {
            const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=1f1faeb0cf9e49999de1fc29b4128294`);
            console.log(response.data.results[0].formatted);
            setAddress(response.data.results[0].formatted);
        };

        const fetchOrder = async () => {
            const response = await axios.get(`https://restaurant-backend-2-mad1.onrender.com/getorder/${id}`);
            setStatus(response.data.status);
            setVisible(response.data.status === 'Cancelled');
        };

        fetchOrder();

        if (status === 'Fulfilled') {
            alert('Your order is prepared and is on the way');
            setTimeout(() => {
                navigate('/');
            }, 3000);
        }

        if (status === 'Cancelled') {
            alert('Your order is Cancelled');
            setTimeout(() => {
                navigate('/menu');
            }, 3000);
        }

        fetch();
    }, [id, lat, long, navigate, status]);

    return (
        <div style={styles.container}>
            <Header/>
            <h1 style={styles.address}>{address}</h1>
            <GoogleMap style={styles.map} />
            <h1 style={styles.status}>Status of your order is {status}</h1>
            {visible && (
                <h1 style={styles.reason}>Reason for cancellation: {reason}</h1>
            )}
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: 'black',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
    },
    address: {
        color: 'white',
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '1.5em',
        
    },
    map: {
        width: '80%',
        height: '50%',
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: '20px',
    },
    status: {
        color: 'white',
        textAlign: 'center',
        fontSize: '1.2em',
        marginBottom: '20px',
    },
    reason: {
        color: 'red',
        textAlign: 'center',
        fontSize: '1.2em',
    },
};
