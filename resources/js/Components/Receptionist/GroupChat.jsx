import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Echo from './../echo';
import SideMenu from './SideMenu';

export default function GroupChat() {
  const chatId = 1;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const token = localStorage.getItem('token');
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId=user.id; 
  const [users, setUsers] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [maxVisibleUsers,setMaxVisibleUser] = useState(3);
  const visibleUsers = showAllUsers ? users : users.slice(0, maxVisibleUsers);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  }, [token]);

  // useEffect(() => {
  //   // Display up to maxVisibleUsers, and then show a count
  //   if (users.length > maxVisibleUsers) {
  //     setVisibleUsers(users.slice(0, maxVisibleUsers));
  //   } else {
  //     setVisibleUsers(users);
  //   }
  // }, [users, maxVisibleUsers]);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Fetch old messages
    axios.get(`http://127.0.0.1:8000/api/group-chats/${chatId}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setMessages(res.data));

    // Listen for new messages
    Echo.channel(`group-chat.${chatId}`)
      .listen('.GroupMessageSent', (e) => {
        setMessages(prev => [...prev, e]);
      });

    return () => {
      Echo.leave(`group-chat.${chatId}`);
    };
  }, [chatId, token]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsSending(true);
    try {
      await axios.post(`http://127.0.0.1:8000/api/group-chats/${chatId}/messages`, {
        content: input
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInput('');
    } finally {
      setIsSending(false);
    }
  };

  // Generate random pastel color based on sender ID
  const getSenderColor = (senderId) => {
    const colors = [
      '#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB',
      '#B5EAD7', '#C7CEEA', '#F8B195', '#F67280',
      '#7474d2', '#6C5B7B', '#355C7D', '#A8E6CE'
    ];
    return colors[senderId % colors.length];
  };
  // console.log(user);
  return (
    <div className="chat-app">
      <SideMenu />

      <div className="chat-container">
        <div className="chat-header">
          <h1 className="chat-title">Group Chat <span className="pulse-dot"></span></h1>
          <div className="active-users">
          {visibleUsers.map(user => (
            <span
              key={user.id}
              className="user-bubble"
              style={{ background: getSenderColor(user.id) }}
              title={`${user.firstname} ${user.lastname}`}
            >
              {user.firstname?.charAt(0) || 'U'}
            </span>
          ))}

          {users.length > maxVisibleUsers && (
            <span
              onClick={() => setShowAllUsers(prev => !prev)}
              className="user-count"
              style={{ cursor: 'pointer' }}
            >
              {showAllUsers ? '−' : `+ ${users.length - maxVisibleUsers}`}
            </span>
          )}
          </div>
        </div>

        <div className="messages-container">
          <div className="messages">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`message ${msg.sender?.id === parseInt(userId) ? 'right' : 'left'}`}
                style={{ '--sender-color': getSenderColor(msg.sender?.id || 0) }}
              >
                <div className="message-sender">
                  <div className="sender-avatar" style={{ background: getSenderColor(msg.sender?.id || 0) }}>
                    {msg.sender?.firstname?.charAt(0) || 'U'}
                  </div>
                  <span className="sender-name">{msg.sender?.firstname || 'Unknown'}</span>
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    {msg.content}
                  </div>
                  <div className="message-time">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={sendMessage} className="message-form">
          <div className="input-container">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              className="message-input"
            />
            <button
              type="submit"
              className="send-button"
              disabled={isSending || !input.trim()}
            >
              {isSending ? (
                <div className="send-spinner"></div>
              ) : (
                <svg className="send-icon" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                </svg>
              )}
            </button>
          </div>
          <div className="form-actions">
            {/* <button type="button" className="action-button">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path>
              </svg>
            </button>
            <button type="button" className="action-button">
              <svg viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"></path>
                <path d="M14.5 11.5H16v-6h-3V7h1.5zM12 10H9V9h2c.55 0 1-.45 1-1V6.5c0-.55-.45-1-1-1H7.5V7h3v1h-2c-.55 0-1 .45-1 1v2.5H12V10z"></path>
              </svg>
            </button> */}
          </div>
        </form>
      </div>

      <style jsx>{`
        .chat-app {
          display: flex;
          height: 100vh;
          padding-left: 80px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .chat-header {
          padding: 20px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
        }

        .chat-title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
          display: flex;
          align-items: center;
        }

        .pulse-dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          background: #4CAF50;
          border-radius: 50%;
          margin-left: 10px;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }

        .active-users {
          display: flex;
          align-items: center;
        }

        .user-bubble {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-weight: bold;
          margin-left: -10px;
          border: 2px solid white;
          transition: transform 0.3s ease;
        }

        .user-bubble:hover {
          transform: translateY(-5px);
        }

        .user-count {
          margin-left: 5px;
          color: #666;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 0px;
          background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==');
        }

        .messages {
          display: flex;
          flex-direction: column;
          gap: 15px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .message {
          display: flex;
          flex-direction: column;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .message.left {
          align-items: flex-start;
        }

        .message.right {
          align-items: flex-end;
        }

        .message-sender {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
        }

        .sender-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-weight: bold;
          margin-right: 8px;
          font-size: 0.8rem;
        }

        .sender-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: #555;
        }

        .message-content {
          display: flex;
          flex-direction: column;
        }

        .message-bubble {
          padding: 12px 16px;
          border-radius: 18px;
          max-width: 70%;
          min-width: 100px;
          position: relative;
          word-wrap: break-word;
          line-height: 1.4;
          animation: bubblePop 0.2s ease-out;
        }

        @keyframes bubblePop {
          0% { transform: scale(0.9); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .message.left .message-bubble {
          background-color: var(--sender-color);
          color: white;
          border-top-left-radius: 5px;
        }

        .message.right .message-bubble {
          background-color: #007AFF;
          color: white;
          border-top-right-radius: 5px;
        }

        .message-time {
          font-size: 0.7rem;
          color: #999;
          margin-top: 4px;
          text-align: right;
        }

        .message-form {
          padding: 15px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .input-container {
          display: flex;
          align-items: center;
          background: #f0f2f5;
          border-radius: 25px;
          padding: 5px 15px;
          transition: all 0.3s ease;
        }

        .input-container:focus-within {
          box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
          background: white;
        }

        .message-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 10px 0;
          font-size: 1rem;
          outline: none;
          color: #333;
        }

        .send-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f44336;
          border: none;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
        }

        .send-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .send-button:not(:disabled):hover {
          transform: scale(1.1);
          background:rgb(193, 47, 37);
        }

        .send-icon {
          width: 20px;
          height: 20px;
          fill: white;
        }
        
        .send-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .form-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }
        
        .action-button {
          background: none;
          border: none;
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          color: #666;
          transition: all 0.2s ease;
        }
        
        .action-button:hover {
          background: rgba(0, 0, 0, 0.05);
          color: #007AFF;
        }
        
        .action-button svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }
      `}</style>
    </div>
  );
}