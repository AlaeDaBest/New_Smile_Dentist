import { useEffect, useState } from 'react';
import axios from 'axios';
import Echo from './echo'; // your Echo instance setup

export default function GroupChat({ chatId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Listen for global events if needed
    Echo.channel('my-channel')
      .listen('my-event', (e) => {
        console.log('Received on my-channel:', e);
      });

    return () => {
      Echo.leave('my-channel');
    };
  }, []);

  useEffect(() => {
    // Initial fetch
    axios.get(`http://127.0.0.1:8000/api/group-chats/${chatId}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setMessages(res.data));

    // Listen to group-specific channel
    Echo.channel(`group-chat.${chatId}`)
      .listen('GroupMessageSent', (e) => {
        setMessages(prev => [...prev, e.message]); // adjust depending on event payload
      });

    return () => {
      Echo.leave(`group-chat.${chatId}`);
    };
  }, [chatId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    await axios.post(`http://127.0.0.1:8000/api/group-chats/${chatId}/messages`, {
      content: input
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setInput('');
  };

  return (
    <div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id}>
            <strong>{msg.sender?.firstname ?? 'Unknown'}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
