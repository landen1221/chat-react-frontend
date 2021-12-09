import React, { useState } from 'react';

function JoinRoomForm({ socket, setShowChat, user, setUser, room, setRoom }) {
    const joinRoom = () => {
        if (user !== '' && room !== '') {
            socket.emit('join_room', room);
            setShowChat(true);
        }
    };
    return (
        <div className="joinChat">
            <h3>Join Chat</h3>
            <form onSubmit={joinRoom}>
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
            </form>
        </div>
    );
}

export default JoinRoomForm;
