import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/JoinRoomForm.css';

function JoinRoomForm({ socket, setShowChat, user, setUser, room, setRoom }) {
    const joinRoom = () => {
        if (user === '') {
            toast.error('Please enter a name/username');
        } else if (room === '') {
            toast.error('Please enter a room name');
        } else {
            sessionStorage.setItem('user', user);
            socket.emit('join_room', room);
            setShowChat(true);
        }
    };
    return (
        <div className="JoinRoomForm">
            <h2>Join Chat</h2>
            <input
                type="text"
                placeholder="Enter name or username*"
                value={user}
                onChange={(event) => {
                    setUser(event.target.value);
                }}
                onKeyPress={(event) => {
                    event.key === 'Enter' && joinRoom();
                }}
            />
            <input
                type="text"
                placeholder="Enter room name that you'd like to join or create*"
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
