import axios from 'axios';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Uploadmenu.scss';

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
  const [name,setname]=useState();
  const [soc,setsoc]=useState();
  const [clients, setClients] = useState({});
  const socket = io('https://restaurant-backend-4-yqs6.onrender.com', { transports: ['websocket'] });

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server with',socket.id);
      // Emit 'foodname' event to server if needed
    });

    socket.on('message', () => {
      socket.emit('foodname', { username: localStorage.getItem('username'), foodname, name: 'aar', orderid: localStorage.getItem('orderid') });
    });

    socket.on('food', (data) => {
        // Check if data.foodname is a valid JSON string
        setOrder(data.orderid);
        setname(data.username);
        setsoc(data.id);
        if (data.foodname) {
            try {
                // Parse the JSON-encoded string in data.foodname to a JavaScript array
                const parsedFoodname = JSON.parse(data.foodname);
    
                // Update the state with the parsed data
                setClients({
                    ...data,
                    foodname: parsedFoodname,
                });
            } catch (error) {
                console.error('Error parsing JSON:', error);
                // Handle the error (e.g., set clients.foodname to an empty array)
                setClients({
                    ...data,
                    foodname: [],
                });
            }
        } else {
            // If data.foodname is empty, set clients.foodname to an empty array
            setClients({
                ...data,
                foodname: [],
            });
        }
    
        // Store the username in localStorage
        localStorage.setItem('clientsUsername', data.username);
    
        // Emit the status to the server
       
    });
    

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchData();

    // Toggle visibility of input based on global status
    setVisible(globalStatus === 'Cancelled');
    localStorage.setItem('reason', reason);
  }, [globalStatus, reason]);

  console.log('clients:', clients);
  console.log('clients.foodname:', clients.foodname);

  // Function to handle file change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
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
  const handleGlobalStatusChange = (event) => {
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
            id:soc
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
    
    // Check if clients array is defined and is an array
    if (clients && Array.isArray(clients.foodname)) {
        return clients.foodname.map((client, index) => (
            <tr key={index}>
                <td>{client.description}</td>
                <td style={{ color: 'white' }}>₹{client.price}</td>
                <td style={{ color: 'white' }}>{client.quantity}</td>
            </tr>
        ));
    } else {
        return null;
    }
  };

  return (
    <div>
      <h1>Ordered Food Items</h1>
      <table style={{ color: 'white' }}>
        <thead>
          <tr>
            <th>Food Name</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody style={{ color: 'white' }}>
          {renderClients()}
        </tbody>
      </table>

      <div>
        <label>Status:</label>
        <select value={globalStatus} onChange={handleGlobalStatusChange}>
          <option value='Pending'>Pending</option>
          <option value='Fulfilled'>Fulfilled</option>
          <option value='Cancelled'>Cancelled</option>
        </select>
        <button onClick={handleSave}>Save</button>
      </div>

      {visible && (
        <div>
          <label>Reason for cancelling:</label>
          <input
            type='text'
            placeholder='Reason for cancelling'
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
        </div>
      )}

      <div className='uploadmenu'>
        <form onSubmit={handleSubmit} encType='multipart/form-data'>
          <input type='file' name='file' onChange={handleFileChange} />
          <input
            type='text'
            placeholder='About food'
            value={aboutFood}
            onChange={e => setAboutFood(e.target.value)}
          />
          <input
            type='number'
            placeholder='Price'
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
          <button type='submit'>Upload</button>
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
    </div>
  );
}
