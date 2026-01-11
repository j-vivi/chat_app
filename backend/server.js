// Logs a message to confirm that the server file has been successfully loaded
console.log("SERVER FILE LOADED");

// Importing required libraries
const express = require("express");       // Express is used to create the web server
const http = require("http");             // HTTP is used to create the server instance
const { Server } = require("socket.io");  // Socket.io enables real-time communication
const cors = require("cors");             // CORS allows requests from different origins

// Create an Express application
const app = express();

// Enable CORS so frontend (React) can communicate with backend
app.use(cors());

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.io server and allow connections from React frontend
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000" // Frontend URL allowed to connect
  }
});

// This array stores all chat messages in memory
let messages = [];

// This runs whenever a new user connects to the server
io.on("connection", (socket) => {
  console.log("User connected");

  // Send previous chat messages to the newly connected user
  socket.emit("history", messages);

  // Listen for new messages sent from any user
  socket.on("send", (data) => {
    // Store the message in the messages array
    messages.push(data);

    // Broadcast the message to all connected users
    io.emit("receive", data);
  });
});

// Start the server on port 5000
server.listen(5000, () => {
  console.log("Backend running on port 5000");
});
