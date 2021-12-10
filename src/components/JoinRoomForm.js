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
            <h4>Type room id to either create a room or join an active chat</h4>
            <input
                type="text"
                placeholder="Enter your name"
                onChange={(event) => {
                    setUser(event.target.value);
                }}
                onKeyPress={(event) => {
                    event.key === 'Enter' && joinRoom();
                }}
            />
            <input
                type="text"
                placeholder="Room Name"
                onChange={(event) => {
                    setRoom(event.target.value);
                }}
                onKeyPress={(event) => {
                    event.key === 'Enter' && joinRoom();
                }}
            />
            <button onClick={joinRoom}>Join</button>
        </div>
    );
}

export default JoinRoomForm;
