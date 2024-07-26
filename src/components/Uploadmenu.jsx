import axios from 'axios';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Uploadmenu.scss'
import PendingOrders from './PendingOrders';
import Header from './Header';
export default function Uploadmenu() {
  const [file, setFile] = useState(null);
  const [aboutFood, setAboutFood] = useState('');
  const [uploadedFoodData, setUploadedFoodData] = useState([]);
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [foodname, setFoodname] = useState(() => JSON.parse(localStorage.getItem('foodname')) || []);
  const [globalStatus, setGlobalStatus] = useState('Pending');
  const [visible, setVisible] = useState(false);
  const [reason, setReason] = useState('');
  const [order, setOrder] = useState([]);
  const [name, setName] = useState();
  const [soc, setSoc] = useState();
  const [clients, setClients] = useState({});
  // https://restaurant-backend-4-yqs6.onrender.com
  const socket = io('https://restaurant-backend-4-yqs6.onrender.com', { transports: ['websocket'] });

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server with', socket.id);
    });

    socket.on('message', () => {
      socket.emit('foodname', {
        username: localStorage.getItem('username'),
        foodname,
        name: 'aar',
        orderid: localStorage.getItem('orderid')
      });
    });

    socket.on('food', data => {
      setOrder(data.orderid);
      setName(data.username);
      setSoc(data.id);
      if (data.foodname) {
        try {
          const parsedFoodname = JSON.parse(data.foodname);
          setClients({
            ...data,
            foodname: parsedFoodname,
          });
        } catch (error) {
          console.error('Error parsing JSON:', error);
          setClients({
            ...data,
            foodname: [],
          });
        }
      } else {
        setClients({
          ...data,
          foodname: [],
        });
      }
      localStorage.setItem('clientsUsername', data.username);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchData();
    setVisible(globalStatus === 'Cancelled');
    localStorage.setItem('reason', reason);
  }, [globalStatus, reason]);

  console.log('clients:', clients);
  console.log('clients.foodname:', clients.foodname);

  // Function to handle file change
  const handleFileChange = event => {
    setFile(event.target.files[0]);
  };

  // Function to handle form submission
  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('aboutFood', aboutFood);
      formData.append('price', price);

      const response = await axios.post('https://restaurant-backend-2-mad1.onrender.com/uploadfood', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful:', response.data);
      setAboutFood('');
      setFile(null);
      fetchData();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Function to fetch data
  const fetchData = async () => {
    try {
      const response = await axios.get('https://restaurant-backend-2-mad1.onrender.com/uploadfood');
      console.log(response.data);
      setUploadedFoodData(response.data);
    } catch (error) {
      console.error('Error fetching uploaded food data:', error);
    }
  };

  // Function to handle global status change
  const handleGlobalStatusChange = event => {
    const newStatus = event.target.value;
    setGlobalStatus(newStatus);

    // Update the status of all foodname items
    const updatedFoodname = foodname.map(item => ({ ...item, status: newStatus }));
    setFoodname(updatedFoodname);
    localStorage.setItem('foodname', JSON.stringify(updatedFoodname));
  };

  // Function to handle save button click
  const handleSave = async () => {
    const username = localStorage.getItem('username');

    try {
      const response = await axios.post('https://restaurant-backend-2-mad1.onrender.com/set-status', {
        status: globalStatus,
        username,
        id: clients?.orderid,
      });

      console.log('Order status saved:', response.data);

      socket.emit('status', {
        username: name,
        globalStatus,
        name: 'aar',
        orderid: order,
        id: soc,
        reason
      });

      // If the global status is fulfilled, clear the table
      setFoodname([]);
      localStorage.removeItem('foodname');
    } catch (error) {
      console.error('Error saving order status:', error);
    }
  };

  // Function to render the clients' ordered food items
  const renderClients = () => {
    console.log('Rendering clients.foodname:', clients.foodname);
    
    if (clients && Array.isArray(clients.foodname)) {
      return clients.foodname.map((client, index) => (
        <tr key={index}>
          <td style={{ border: '1px solid red', padding: '10px', color: 'white' }}>{client.description}</td>
          <td style={{ border: '1px solid red', padding: '10px', color: 'white' }}>₹{client.price}</td>
          <td style={{ border: '1px solid red', padding: '10px', color: 'white' }}>{client.quantity}</td>
        </tr>
      ));
    } else {
      return null;
    }
  };

  return (
    <div style={{ backgroundColor: 'black', color: 'white', padding: '20px', minHeight: '100vh' }}>
      <Header/>
      <h1>Ordered Food Items</h1>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid red', padding: '10px', color: 'white' }}>Food Name</th>
            <th style={{ border: '1px solid red', padding: '10px', color: 'white' }}>Price</th>
            <th style={{ border: '1px solid red', padding: '10px', color: 'white' }}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {renderClients()}
        </tbody>
      </table>

      <div style={{ marginTop: '20px' }}>
        <label style={{ color: 'white' }}>Status:</label>
        <select
          value={globalStatus}
          onChange={handleGlobalStatusChange}
          style={{
            backgroundColor: 'black',
            color: 'white',
            border: '1px solid red',
            padding: '5px 10px',
            marginRight: '10px',
          }}
        >
          <option value="Pending">Pending</option>
          <option value="Fulfilled">Fulfilled</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button
          onClick={handleSave}
          style={{
            backgroundColor: '#f56565', // Tailwind red-500
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            border: 'none',
          }}
          onMouseEnter={e => (e.target.style.backgroundColor = '#e53e3e')} // Tailwind red-600
          onMouseLeave={e => (e.target.style.backgroundColor = '#f56565')}
        >
          Save
        </button>
      </div>

      {visible && (
        <div style={{ marginTop: '20px' }}>
          <label style={{ color: 'white' }}>Reason for cancelling:</label>
          <input
            type="text"
            placeholder="Reason for cancelling"
            value={reason}
            onChange={e => setReason(e.target.value)}
            style={{
              backgroundColor: 'black',
              color: 'white',
              border: '1px solid red',
              padding: '5px 10px',
            }}
          />
        </div>
      )}

      <div className="uploadmenu">
        <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ marginTop: '20px' }}>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            style={{
              color: 'white',
              backgroundColor: 'black',
              border: '1px solid red',
              padding: '5px 10px',
              marginBottom: '10px',
            }}
          />
          <input
            type="text"
            placeholder="About food"
            value={aboutFood}
            onChange={e => setAboutFood(e.target.value)}
            style={{
              backgroundColor: 'black',
              color: 'white',
              border: '1px solid red',
              padding: '5px 10px',
              marginBottom: '10px',
            }}
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={e => setPrice(e.target.value)}
            style={{
              backgroundColor: 'black',
              color: 'white',
              border: '1px solid red',
              padding: '5px 10px',
              marginBottom: '10px',
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#f56565', // Tailwind red-500
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              border: 'none',
            }}
            onMouseEnter={e => (e.target.style.backgroundColor = '#e53e3e')} // Tailwind red-600
            onMouseLeave={e => (e.target.style.backgroundColor = '#f56565')}
          >
            Upload
          </button>
        </form>

        <div className='image-container'>
{uploadedFoodData && uploadedFoodData.length > 0 ? (
  uploadedFoodData.map((foodItem, index) => (
    <div key={index}>
      <img src={`${foodItem.url}`} alt='Uploaded Food' />
      <p>{foodItem.description}</p>
      <p>₹{foodItem.price}</p>
      <div className='box'>
        <button onClick={() => setQuantity(Math.max(0, quantity - 1))}>-</button>
        <p>{quantity}</p>
        <button onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>
    </div>
  ))
) : (
  <p>No uploaded food data available</p>
)}
</div>
      </div>
      <PendingOrders/>
    </div>
  );
}




