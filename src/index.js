const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0;
let welcomeMessage = 'Welcome!'

io.on("connection", (socket) => {
    console.log("New WebSocket Connection");

    socket.emit('message', welcomeMessage)
    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on("sendMessage", (message) => {
        io.emit('message', message)
    })

    socket.on("disconnect", () => {
      io.emit('message', "A user has left!")
    })
  });

server.listen(port, () => {
    console.log(`Server up on port ${port}`);
})
