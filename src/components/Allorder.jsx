import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Header from './Header';

export default function AllOrder() {
    const [orders, setOrders] = useState([]);

    // Function to fetch all orders
    const fetchOrders = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('https://restaurant-backend-q89z.onrender.com/getorder', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    // Use the useEffect hook to fetch orders when the component mounts
    useEffect(() => {
        fetchOrders();
    }, []);


    return (
        <>
        <Header/>
        <div style={{ backgroundColor: 'black', color: 'red', padding: '20px' }}>
            
            <h1>All Orders</h1>
            {orders.map((order, index) => (
                <div key={index} style={{ marginBottom: '20px', border: '1px solid red', padding: '10px' }}>
                    <h2>Order {index + 1}</h2>
                    <div>
                        <p><strong>Items:</strong></p>
                        <ul style={{ color: 'white',listStyle:'none' }}>
                            {order.items.map((item, itemIndex) => (
                                <li key={itemIndex} style={{ marginBottom: '5px' }}>
                                    {item.description} - Quantity: {item.quantity}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
        </>
    );
}
