import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PendingOrders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const response = await axios.get('https://restaurant-backend-2-mad1.onrender.com/allorders');
      const allOrders = response.data;

      console.log(allOrders);
      setPendingOrders(allOrders);

      const initialStatuses = {};
      allOrders.forEach((order) => {
        initialStatuses[order._id] = 'Pending';
      });
      setStatuses(initialStatuses);
    } catch (error) {
      console.error('Error fetching pending orders:', error);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setStatuses((prevStatuses) => ({
     ...prevStatuses,
      [orderId]: newStatus,
    }));
  };

  const handleSave = async (orderId) => {
    const username = localStorage.getItem('username');
    const currentStatus = statuses[orderId];

    try {
      const response = await axios.post('https://restaurant-backend-2-mad1.onrender.com/set-status', {
        status: currentStatus,
        username,
        id: orderId,
      });

      console.log('Order status saved:', response.data);
    } catch (error) {
      console.error('Error saving order status:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Pending Orders</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {pendingOrders.map((order) => (
          <div
            key={order._id}
            style={{
              backgroundColor: 'black',
              padding: '20px',
              margin: '20px',
              border: '1px solid #ddd',
              borderRadius: '10px',
              width: '300px',
            }}
          >
            <h2 style={{ marginTop: '0' }}>Order ID: {order._id}</h2>
            <p style={{ marginBottom: '10px' }}>Customer Name: {order.user}</p>
            <p style={{ marginBottom: '10px' }}>
              Items:
              <ul>
                {order.items.map((item) => (
                  <li key={item._id}>
                    {item.description} (x{item.quantity}) - ${item.price}
                  </li>
                ))}
              </ul>
            </p>
            <p style={{ marginBottom: '10px' }}>Status: {statuses[order._id]}</p>
            <select
              value={statuses[order._id]}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                color:'black'
              }}
            >
              <option value="Pending">Pending</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => handleSave(order._id)}
              style={{
                backgroundColor: '#e21837',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Save Status
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingOrders;