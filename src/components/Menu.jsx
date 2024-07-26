import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContextProvider';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

export default function Menu() {
    const { foodname, setfoodname, settotal } = useContext(UserContext);
    const [uploadedFoodData, setUploadedFoodData] = useState([]);
    const [quantityMap, setQuantityMap] = useState({});
    const navigate = useNavigate();

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://restaurant-backend-2-mad1.onrender.com/uploadfood');
                setUploadedFoodData(response.data);
                const initialQuantityMap = {};
                response.data.forEach((foodItem) => {
                    initialQuantityMap[foodItem._id] = 0;
                });
                setQuantityMap(initialQuantityMap);
            } catch (error) {
                console.error('Error fetching uploaded food data:', error);
            }
        };

        fetchData();
    }, []);

    // Increment item quantity
    const handleIncrement = (foodItemId) => {
        setQuantityMap((prevQuantityMap) => ({
            ...prevQuantityMap,
            [foodItemId]: prevQuantityMap[foodItemId] + 1,
        }));
    };

    // Decrement item quantity
    const handleDecrement = (foodItemId) => {
        if (quantityMap[foodItemId] > 0) {
            setQuantityMap((prevQuantityMap) => ({
                ...prevQuantityMap,
                [foodItemId]: prevQuantityMap[foodItemId] - 1,
            }));
        }
    };

    // Add item to cart and calculate total
    const addToCart = (description, price, quantity) => {
        setfoodname([...foodname, { description, price, quantity }]);
        calculateAndSetTotal(); // Calculate and set total
    };

    // Calculate and set total price
    const calculateAndSetTotal = () => {
        const totalPrice = foodname.reduce((acc, item) => {
            return acc + (item.price * item.quantity);
        }, 0);

        settotal(totalPrice);
        return totalPrice;
    };

    // Toggle cart visibility
    const [isCartVisible, setIsCartVisible] = useState(false);

    const toggleCartVisibility = () => {
        setIsCartVisible(!isCartVisible);
    };

    // Render component
    return (
        <>
            <Header />
            <div>
                <div className='image-container'>
                    <button
                        style={{
                            position: 'fixed',
                            top: '38px',
                            right: '20px',
                            left: '74%',
                            backgroundColor: '#E21837',
                            color: 'white',
                            borderRadius: '30px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px',
                            zIndex: 1001,
                        }}
                        className='cart-text'
                        onClick={toggleCartVisibility}
                    >
                        Cart
                    </button>
                    {uploadedFoodData && uploadedFoodData.length > 0 ? (
                        uploadedFoodData.map((foodItem) => (
                            <div key={foodItem._id}>
                                <img src={`${foodItem.url}`} alt='Uploaded Food' />
                                <h1>{foodItem.description}</h1>
                                <h1>₹{foodItem.price}</h1>
                                <div className='box'>
                                    <button onClick={() => handleDecrement(foodItem._id)}>--</button>
                                    <p>{quantityMap[foodItem._id]}</p>
                                    <button onClick={() => handleIncrement(foodItem._id)}>+</button>
                                </div>
                                <button id='x' onClick={() => addToCart(foodItem.description, foodItem.price, quantityMap[foodItem._id])}>
                                    Add to cart
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No uploaded food data available</p>
                    )}
                </div>

                <div className='cart' style={{
                    display: isCartVisible ? 'block' : 'none',
                    position: 'fixed',
                    top: 70,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    zIndex: 1000,
                    padding: '20px',
                    overflowY: 'auto',
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '5px',
                        padding: '20px',
                        margin: 'auto',
                        maxWidth: '800px',
                    }}>
                        <h1 style={{ color: 'red', borderBottom: '2px solid red', paddingBottom: '10px', textAlign: 'center', fontWeight: 'bold' }}>CART</h1>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {foodname.map((item, index) => (
                                <li key={index} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px', color: 'red' }}>
                                    <h3 style={{ margin: 0 }}>{item.description}</h3>
                                    <p style={{ margin: 0 }}>Total: ₹{item.price * item.quantity}</p>
                                </li>
                            ))}
                        </ul>

                        <h1 style={{ marginTop: '20px', textAlign: 'center' }}>Total: ₹{calculateAndSetTotal()}</h1>

                        {foodname.length > 0 ? (
                            <button
                                id='btn'
                                style={{
                                    backgroundColor: 'red',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    border: 'none',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    marginTop: '20px',
                                    display: 'block',
                                    margin: '0 auto',
                                }}
                                onClick={async () => {
                                    try {
                                        navigate('/confirmation');
                                        const token = localStorage.getItem('token');
                                        localStorage.setItem('foodname', JSON.stringify(foodname));

                                        const response = await axios.get('https://restaurant-backend-2-mad1.onrender.com/sendmail', {
                                            headers: {
                                                Authorization: `Bearer ${token}`,
                                            },
                                        });

                                        localStorage.setItem('otp', JSON.stringify(response.data));
                                    } catch (error) {
                                        console.error('Error:', error);
                                    }
                                }}
                            >
                                Confirm Order
                            </button>
                        ) : (
                            <h1 style={{color:'red'}}>Cart is empty</h1>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
