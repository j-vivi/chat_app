console.log("SERVER FILE LOADED");

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

let messages = [];

io.on("connection", (socket) => {
  console.log("User connected");

  socket.emit("history", messages);

  socket.on("send", (data) => {
    messages.push(data);
    io.emit("receive", data);
  });
});

server.listen(5000, () => {
  console.log("Backend running on port 5000");
});
