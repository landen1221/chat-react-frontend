import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

function ChatRoom({ socket, user, room }) {
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (message.trim() === '') return;

        const time =
            new Date(Date.now()).getHours() +
            ':' +
            new Date(Date.now()).getMinutes();
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
            <div className="chat-room">
                <h1>Chat Room {room}</h1>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="chat-messages">
                    {messageList.map((msg, idx) => (
                        <div
                            className="message"
                            key={idx}
                            id={user === msg.user ? 'you' : 'other'}
                        >
                            <h3>{msg.message}</h3>
                        </div>
                    ))}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
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
