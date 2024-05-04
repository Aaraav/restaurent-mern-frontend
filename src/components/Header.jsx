import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import './Header.scss';

export default function Header() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get('https://restaurant-backend-q89z.onrender.com/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setData(response.data.user);
                setLoading(false);
                localStorage.setItem('email',response.data.user.email);
                localStorage.setItem('username',response.data.user.username);

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

        alert('successfully Logged out');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="restaurant">
                <h2>UrbanGrove Eatery</h2>
                <ul>
                    <Link to="/" style={{ textDecoration: 'none'}}><li>Home</li></Link>
                    <Link to='/menu' style={{ textDecoration: 'none'}}><li>Menu</li></Link>
                    {/* <Link to='/signup' style={{ textDecoration: 'none'}}><li>Sign up</li></Link> */}
                    {/* <Link to='/login' style={{ textDecoration: 'none'}}><li>Login</li></Link> */}
                    <Link to='/allorders' style={{ textDecoration: 'none'}}><li>orders</li></Link>

                    <li>
                        <button onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
                {data && <p>Welcome, <span>{data.username}</span></p>}
            </div>
        </div>
    );
}
