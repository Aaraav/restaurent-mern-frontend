import axios from 'axios';
import React, { useEffect, useState } from 'react';
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
    const [reason,setreason]=useState('');

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

            const response = await axios.post('http://localhost:9000/uploadfood', formData, {
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
            const response = await axios.get('http://localhost:9000/uploadfood');
            console.log(response.data);
            setUploadedFoodData(response.data);
        } catch (error) {
            console.error('Error fetching uploaded food data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        
        // Toggle visibility of input based on global status
        setVisible(globalStatus === 'Cancelled');
        localStorage.setItem('reason',reason);
    }, [globalStatus]);

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
            const response = await axios.post('https://restaurant-backend-q89z.onrender.com/set-status', {
                status: globalStatus,
                username,
                id: localStorage.getItem('orderid'),
            });
        
            console.log('Order status saved:', response.data);

            // If the global status is fulfilled, clear the table
                setFoodname([]);
                localStorage.removeItem('foodname');
            
        } catch (error) {
            console.error('Error saving order status:', error);
        }
    };

    return (
        <div>
            <h1>Ordered Food Items</h1>
            <table style={{ color: 'white' }}>
                <thead>
                    <tr>
                        <th>Food Name</th>
                        <th>Quantity</th>
                        <th>Username</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody style={{ color: 'white' }}>
                    {foodname.map((item, index) => (
                        <tr key={index}>
                            <td>{item.description}</td>
                            <td>{item.quantity}</td>
                            <td>{localStorage.getItem('username')}</td>
                            <td>{item.status}</td>
                        </tr>
                    ))}
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
                    <input type='text' placeholder='Reason for cancelling' onChange={(e)=>setreason(e.target.value)} />
                </div>
            )}

            <div className='uploadmenu'>
                <form onSubmit={handleSubmit} encType='multipart/form-data'>
                    <input type='file' name='file' onChange={handleFileChange} />
                    <input
                        type='text'
                        placeholder='About food'
                        value={aboutFood}
                        onChange={(e) => setAboutFood(e.target.value)}
                    />
                    <input
                        type='number'
                        placeholder='Price'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <button type='submit'>Upload</button>
                </form>

                <div className='image-container'>
                    {uploadedFoodData && uploadedFoodData.length > 0 ? (
                        uploadedFoodData.map((foodItem, index) => (
                            <div key={index}>
                                <img src={`https://restaurant-backend-q89z.onrender.com/${foodItem.image}`} alt='Uploaded Food' />
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
