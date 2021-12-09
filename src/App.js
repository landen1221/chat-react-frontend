import './App.css';
import React, { useState } from 'react';
import io from 'socket.io-client';
import ChatRoom from './ChatRoom';

const socket = io.connect('http://localhost:3001');

function App() {
    const [user, setUser] = useState('');
    const [room, setRoom] = useState('');
    const [showChat, setShowChat] = useState(false);

    const joinRoom = () => {
        if (user !== '' && room !== '') {
            socket.emit('join_room', room);
            setShowChat(true);
        }
    };

    return (
        <div className="App">
            {!showChat ? (
                <div className="joinChat">
                    <h3>Join Chat</h3>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        onChange={(event) => {
                            setUser(event.target.value);
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Room Name"
                        onChange={(event) => {
                            setRoom(event.target.value);
                        }}
                    />
                    <button onClick={joinRoom}>Join</button>
                </div>
            ) : (
                <ChatRoom socket={socket} user={user} room={room} />
            )}
        </div>
    );
}

export default App;
