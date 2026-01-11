import { useEffect, useState } from "react";
import socket from "./socket";
import "./index.css";

function Chat({ name }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("history", (data) => setMessages(data));
    socket.on("receive", (data) =>
      setMessages((prev) => [...prev, data])
    );

    return () => {
      socket.off("history");
      socket.off("receive");
    };
  }, []);

  const send = () => {
    if (!text) return;
    socket.emit("send", { user: name, text });
    setText("");
  };

  return (
    <div className="chat-container">
      <div className="header">{name}</div>

      <div className="messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.user === name ? "bubble me" : "bubble other"}
          >
            <strong>{m.user}</strong>
            <div>{m.text}</div>
          </div>
        ))}
      </div>

      <div className="input-box">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type..."
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="dual">
      <Chat name="John" />
      <Chat name="Arthur" />
    </div>
  );
}
