import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import '../css/ChatRoom.css';

function ChatRoom({
    socket,
    user,
    room,
    setShowChat,
    setRoom,
    setIsConnected,
}) {
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [myColor, setMyColor] = useState([]);
    const [otherColor, setOtherColor] = useState([]);

    useEffect(() => {
        const myColors = [
            '#264653',
            '#264653',
            '#8B6969',
            '#A62A2A',
            '#5C3317',
            '#3063A5',
            '#000080',
        ];

        const otherColors = [
            '#E9C46A',
            '#E76F51',
            '#6495ED',
            '#900C3F',
            '#008080',
            '#CD5C5C',
            '#E9967A',
        ];

        const getColor = (selection) => {
            return {
                backgroundColor:
                    selection[Math.floor(Math.random() * selection.length)],
            };
        };

        setMyColor(getColor(myColors));
        setOtherColor(getColor(otherColors));
    }, []);

    const sendMessage = async () => {
        if (message.trim() === '') return; // prevent empty messages being sent

        function formatAMPM() {
            const date = new Date();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            const timeZone = generateTimeZone(date);
            return `${hours}:${minutes} ${ampm} (${timeZone})`;
        }

        function generateTimeZone(date) {
            const timezone = date.toString().split('(')[1].split(')')[0];
            const splitZone = timezone.split(' ');
            let output = '';
            for (let word of splitZone) {
                output += word[0];
            }
            return output;
        }

        const time = formatAMPM();

        const messageData = { message, room, user, time };
        await socket.emit('send_message', messageData); // send message & msgData to server

        setMessage('');
        setMessageList((msg) => [...msg, messageData]);
    };

    useEffect(() => {
        // Let other users know a new user has joined
        socket.on('joined_room', (user) => {
            setMessageList((msg) => [
                ...msg,
                { message: `${user} joined conversation!` },
            ]);
        });
        // pull incoming messages from server & add to messageList
        socket.on('receive_message', (data) => {
            setMessageList((msg) => [...msg, data]);
        });
        // get all messages for a given room
        socket.on('get_messages', (data) => {
            if (!data) return;
            setMessageList([...data]);
        });
        return () => {
            socket.disconnect();
            setIsConnected(false);
        };
    }, [socket]);

    const leaveRoom = () => {
        setShowChat(false);
        setRoom('');
    };

    return (
        <div className="ChatRoom">
            <button onClick={leaveRoom} id="change-button">
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
                                <p id="new-user">{msg.message}</p>
                            ) : (
                                <div>
                                    <div
                                        id={
                                            user === msg.user
                                                ? 'message-self'
                                                : 'message-other'
                                        }
                                        style={
                                            user === msg.user
                                                ? myColor
                                                : otherColor
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
                    autoFocus
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
