import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import '../css/ChatRoom.css';

function ChatRoom({ socket, user, room }) {
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (message.trim() === '') return;

        function formatAMPM() {
            const date = new Date();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            return hours + ':' + minutes + ' ' + ampm;
        }

        const time = formatAMPM();

        const messageData = { message, room, user, time };
        await socket.emit('send_message', messageData);

        setMessage('');
        setMessageList((msg) => [...msg, messageData]);
    };

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessageList((msg) => [...msg, data]);
        });
    }, [socket]);

    return (
        <div className="ChatRoom">
            <div className="room-name">
                <h2>
                    Chat Room <u>{room}</u>
                </h2>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                    {messageList.map((msg, idx) => (
                        <div>
                            <div
                                className="message"
                                key={idx}
                                id={user === msg.user ? 'self' : 'other'}
                            >
                                <p id="message-content">{msg.message}</p>
                            </div>
                            {/* FIXME: need to place this properly */}
                            {/* <p id="message-info">
                                {msg.user} {msg.time}
                            </p> */}
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
