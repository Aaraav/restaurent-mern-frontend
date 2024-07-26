import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Header from './Header';

let socket = null;

export default function Contact() {
    // State variables
    const [chat, setChat] = useState('');
    const [messages, setMessages] = useState([]);
    const [sender, setSender] = useState('');
// https://restaurant-backend-5-ncc3.onrender.com
    // Initialize socket connection in useEffect
    useEffect(() => {
        if (!socket) {
            socket = io('https://restaurant-backend-5-ncc3.onrender.com', { transports: ['websocket'] });

            // Log connection
            socket.on('connect', () => {
                console.log('User is connected to chat with socket ID:', socket.id);
                socket.emit('register', { username: localStorage.getItem('username') });
            });

            // Listen for chat events
            socket.on('get', ({ chat, sender }) => {
                console.log(`Received chat from ${sender}: ${chat}`);

                // Add incoming messages to the messages state
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender, chat, isOutgoing: false },
                ]);

                setSender(sender);

               

                
            });
            // socket.on('notification', ({ sender, receiver, message }) => {
            //     console.log(`Received notification from ${sender} to ${receiver}: ${message}`);
            //     console.log(`Sender: ${sender}, Receiver: ${receiver}`);
            //     alert(`Received notification from ${sender} to ${receiver}: ${message}`);
            //   });
        }

        return () => {
            if (socket) {
                socket.disconnect();
                socket = null;
            }
        };
    }, []);

    // Function to send chat messages
    const sendChat = () => {
        if (chat.trim() !== '') {
            const receiver = sender ? sender : 'aar';

            // Emit the chat event
            socket.emit('chat', {
                chat,
                sender: localStorage.getItem('username'),
                receiver,
            });
            socket.emit('notification', {
                chat,
                sender: localStorage.getItem('username'),
                receiver,
            });

            // Add the outgoing message to the messages state
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: localStorage.getItem('username'), chat, isOutgoing: true },
            ]);

            // Clear the chat input
            setChat('');
        }
    };

    return (
        <>
            <div style={{ backgroundColor: 'black', width: '100vw', height: '100vh', color: 'white' }}>
                <Header />
                <div>
                    {/* Chat input field */}
                    <input
                        type="text"
                        value={chat}
                        placeholder="Write query"
                        onChange={(e) => setChat(e.target.value)}
                        style={{color:'black'}}
                    />
                    {/* Submit button */}
                    <button style={{
                        
                            backgroundColor: '#E21837',
                            color: 'white',
                            padding:'160x 20px',
                            width:'100px',
                            height:'30px',
                            borderRadius: '30px',
                            border: 'none',
                            cursor: 'pointer',
                            marginLeft:'10px',
                            fontSize: '16px',
                            zIndex: 1001,}} onClick={sendChat}>Submit</button>
                </div>
                
                {/* Display messages */}
                <div style={{ marginTop: '20px' }}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                justifyContent: message.isOutgoing ? 'flex-end' : 'flex-start',
                                margin: '5px 0',
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: '70%',
                                    padding: '10px',
                                    borderRadius: '10px',
                                    backgroundColor: message.isOutgoing ? 'white' : '#e21837',
                                    color: message.isOutgoing ? '#000' : 'white'
                                }}
                            >
                                <strong>{message.isOutgoing ? 'You' : message.sender}:</strong>
                                <br />
                                {message.chat}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}