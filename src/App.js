import './App.css';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import ChatRoom from './components/ChatRoom';
import JoinRoomForm from './components/JoinRoomForm';
import { ToastContainer } from 'react-toastify';

function App() {
    const [showChat, setShowChat] = useState(false);
    const [user, setUser] = useState(sessionStorage.getItem('user') || '');
    const [room, setRoom] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socket = io.connect(
            process.env.REACT_APP_BASE_URL || 'https://localhost:3001'
        );
        setSocket(socket);
        setIsConnected(true);
    }, [isConnected]);

    return (
        <div className="App">
            <h1>EZ Chat</h1>
            <hr />
            {!showChat ? (
                <JoinRoomForm
                    socket={socket}
                    setShowChat={setShowChat}
                    user={user}
                    setUser={setUser}
                    room={room}
                    setRoom={setRoom}
                />
            ) : (
                <ChatRoom
                    socket={socket}
                    user={user}
                    room={room}
                    setShowChat={setShowChat}
                    setRoom={setRoom}
                    setIsConnected={setIsConnected}
                />
            )}
            <ToastContainer position="top-center" autoClose={2000} />
        </div>
    );
}

export default App;
