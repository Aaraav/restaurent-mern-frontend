import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UsersList() {
    const [chatPartners, setChatPartners] = useState([]);

    const history = useNavigate();

    // Fetch chat partners
    useEffect(() => {
        const fetchChatPartners = async () => {
            try {
                const response = await axios.get('https://restaurant-backend-5-ncc3.onrender.com/chat-partners');
                setChatPartners(response.data.chatPartners);
            } catch (error) {
                console.error('Error fetching chat partners:', error);
            }
        };

        fetchChatPartners();
    }, []);

    // Handle user click
    const handleUserClick = (partner) => {
        // history(`/contact/${partner}`); // Navigate to the chat route
    };

    return (
        <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '5px' }}>
            <h3>Chat Partners</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {chatPartners.map((partner, index) => (
                    <li
                        key={index}
                        onClick={() => handleUserClick(partner)} // Call the function when a user is clicked
                        style={{ padding: '5px', borderBottom: '1px solid #ccc', cursor: 'pointer' }}
                    >
                        {partner}
                    </li>
                ))}
            </ul>
        </div>
    );
}
