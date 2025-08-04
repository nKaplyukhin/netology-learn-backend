const express = require("express");
const mongoose = require("mongoose");
const http = require('http');
const socketIo = require('socket.io');
const { bookRouter } = require("./routes/book");
const error404 = require("./middlewares/error-404");

const app = express();
const port = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/books"

const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
app.use("/books", bookRouter);
app.use(error404);

io.on('connection', (socket) => {
  console.log('A user connected');

  const { roomName } = socket.handshake.query;
  if (roomName) {
    socket.join(roomName);
    console.log(`User joined room: ${roomName}`);

    socket.on('newComment', (commentData) => {
      io.to(commentData.roomName).emit('commentAdded', commentData);
    });
  }

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const start = async () => {
  try {
    await mongoose.connect(MONGODB_URL)
    server.listen(port, () => {
      console.log(`Server start on ${port} port`);
    });
  } catch (error) {
    console.log(error);
  }
}

start()