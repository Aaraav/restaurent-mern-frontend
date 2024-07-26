import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Header.scss';

export default function Header() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [vis, setVis] = useState(window.innerWidth > 1000); // Initialize vis based on screen width
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get('https://restaurant-backend-2-mad1.onrender.com/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setData(response.data.user);
                setLoading(false);
                localStorage.setItem('email', response.data.user.email);
                localStorage.setItem('username', response.data.user.username);

                console.log(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/signup');
        alert('Successfully logged out');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    // Retrieve username from local storage
    const username = localStorage.getItem('username');

    return (
        <div>
            <div>
                <div className="restaurant">
                    <h2>UrbanGrove Eatery</h2>
                    {vis && (
                        <ul>
                            <Link to="/" style={{ textDecoration: 'none' }}><li>Home</li></Link>
                            <Link to="/menu" style={{ textDecoration: 'none' }}><li>Menu</li></Link>
                            <Link to="/allorders" style={{ textDecoration: 'none' }}><li>Orders</li></Link>
                            {username !== 'aar' && (
                                <Link to='/contact' style={{ textDecoration: 'none' }}><li>Contact Us</li></Link>
                            )}
                            {/* Conditionally render the "Uploadmenu" link based on the username */}
                            {username === 'aar' && (
                                <Link to="/uploadmenu" style={{ textDecoration: 'none' }}><li>Uploadmenu</li></Link>
                            )}
                            {username === 'aar' && (
                                <Link to="/contact" style={{ textDecoration: 'none' }}><li>Contact</li></Link>
                            )}
                            <li>
                                <button onClick={handleLogout}>Logout</button>
                            </li>
                        </ul>
                    )}
                    <button  onClick={() => setVis(vi=>!vi)} id='toggle' className="nav-toggle-button" >
                        Sections
                    </button>
                    {data && <p>Welcome, <span>{data.username}</span></p>}
                </div>
            </div>
        </div>
    );
}