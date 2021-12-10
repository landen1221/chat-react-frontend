import './App.css';
import React, { useState } from 'react';
import io from 'socket.io-client';
import ChatRoom from './components/ChatRoom';
import JoinRoomForm from './components/JoinRoomForm';

const socket = io.connect(process.env.API_ROUTE || 'http://localhost:3001/');

function App() {
    const [showChat, setShowChat] = useState(false);
    const [user, setUser] = useState('');
    const [room, setRoom] = useState('');

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
                <ChatRoom socket={socket} user={user} room={room} />
            )}
        </div>
    );
}

export default App;
