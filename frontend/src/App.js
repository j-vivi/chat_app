// Importing React hooks for managing component state and lifecycle
import { useEffect, useState } from "react";

// Importing the Socket.IO client library for real-time communication
import { io } from "socket.io-client";

// Importing CSS styles for the application UI
import "./index.css";

// Creating a WebSocket connection to the backend server
const socket = io("http://localhost:5000");

export default function App() {
  // Stores all chat messages received from the server
  const [messages, setMessages] = useState([]);

  // Stores the text typed by John
  const [johnText, setJohnText] = useState("");

  // Stores the text typed by Arthur
  const [arthurText, setArthurText] = useState("");

  // Runs once when the component loads
  useEffect(() => {
    // Receive previous chat history from the server
    socket.on("history", (data) => {
      setMessages(data);
    });

    // Receive new messages in real time
    socket.on("receive", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup: remove socket listeners when component unmounts
    return () => socket.off();
  }, []);

  // Function to send a message from a specific user
  const send = (user, text) => {
    // Prevent sending empty messages
    if (!text.trim()) return;

    // Send the message to the backend using WebSocket
    socket.emit("send", {
      user,
      text,
    });

    // Clear the input field after sending
    if (user === "John") setJohnText("");
    if (user === "Arthur") setArthurText("");
  };

  return (
    // Main container holding both chat panels
    <div className="app">
      
      {/* Chat box for John */}
      <div className="chat-box">
        <h2>John</h2>

        {/* Message display area for John */}
        <div className="messages">
          {messages.map((m, i) => (
            <div
              key={i}
              className={m.user === "John" ? "bubble john" : "bubble arthur"}
            >
              <b>{m.user}</b>
              <br />
              {m.text}
            </div>
          ))}
        </div>

        {/* Input area for John */}
        <div className="input-row">
          <input
            value={johnText}
            onChange={(e) => setJohnText(e.target.value)}
            placeholder="John typing..."
          />
          <button onClick={() => send("John", johnText)}>Send</button>
        </div>
      </div>

      {/* Chat box for Arthur */}
      <div className="chat-box">
        <h2>Arthur</h2>

        {/* Message display area for Arthur */}
        <div className="messages">
          {messages.map((m, i) => (
            <div
              key={i}
              className={m.user === "Arthur" ? "bubble arthur" : "bubble john"}
            >
              <b>{m.user}</b>
              <br />
              {m.text}
            </div>
          ))}
        </div>

        {/* Input area for Arthur */}
        <div className="input-row">
          <input
            value={arthurText}
            onChange={(e) => setArthurText(e.target.value)}
            placeholder="Arthur typing..."
          />
          <button onClick={() => send("Arthur", arthurText)}>Send</button>
        </div>
      </div>
    </div>
  );
}
