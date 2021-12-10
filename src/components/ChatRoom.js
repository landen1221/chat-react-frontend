import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/ChatRoom.css';

function ChatRoom({ socket, user, room, setShowChat }) {
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    // TODO: add if time available
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = async () => {
        if (message.trim() === '') return; // prevent empty messages being sent

        function formatAMPM() {
            const date = new Date();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            return hours + ':' + minutes + ' ' + ampm;
        }

        const time = formatAMPM();

        const messageData = { message, room, user, time };
        await socket.emit('send_message', messageData); // send message & msgData to server

        setMessage('');
        setMessageList((msg) => [...msg, messageData]);
    };

    useEffect(() => {
        socket.on('joined_room', (user) => {
            toast.success(`${user} joined conversation!`);
            setMessageList((msg) => [
                ...msg,
                { message: `${user} joined conversation!` },
            ]);
        });
        // pull incoming messages from server & add to messageList
        socket.on('receive_message', (data) => {
            setMessageList((msg) => [...msg, data]);
        });
    }, [socket]);

    return (
        <div className="ChatRoom">
            <button onClick={() => setShowChat(false)} id="change-button">
                Change Room
            </button>
            <div className="room-name">
                <h2>
                    Chat Room <u>{room}</u>
                </h2>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                    {messageList.map((msg, idx) => (
                        <div
                            key={idx}
                            className="message"
                            id={user === msg.user ? 'self' : 'other'}
                        >
                            {!msg.user ? (
                                <p>{msg.message}</p>
                            ) : (
                                <div>
                                    <div
                                        id={
                                            user === msg.user
                                                ? 'message-self'
                                                : 'message-other'
                                        }
                                    >
                                        <p id="message-content">
                                            {msg.message}
                                        </p>
                                    </div>
                                    <p
                                        className="message-info"
                                        id={
                                            user === msg.user
                                                ? 'message-info-self'
                                                : 'message-info-other'
                                        }
                                    >
                                        {msg.user} --{msg.time}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </ScrollToBottom>
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={message}
                    placeholder="Message..."
                    onChange={(event) => {
                        setMessage(event.target.value);
                    }}
                    onKeyPress={(event) => {
                        event.key === 'Enter' && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
}

export default ChatRoom;
