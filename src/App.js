import './App.css';
import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');

function App() {
    const [user, setUser] = useState();
    return (
        <div className="App">
            <h3>Join Chat</h3>
            <input type="text" placeholder="Enter your name" />
            <input type="text" placeholder="Enter your room" />
            <button>Join</button>
        </div>
    );
}

export default App;
