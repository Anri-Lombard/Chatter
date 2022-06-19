const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const { generateMessage, generateLocation } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0;

io.on("connection", (socket) => {
    console.log("New WebSocket Connection");

    socket.emit('message', generateMessage("Welcome!"))

    socket.broadcast.emit('message', generateMessage('A new user has joined!'))

    socket.on("sendMessage", (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback("Profanity is not allowed!")
        }

        io.emit('message', generateMessage(message))
        callback('Delivered!')
    })

    socket.on("disconnect", () => {
      io.emit('message', generateMessage("A user has left!"))
    })

    socket.on("sendLocation", (coords, callback) => {
      io.emit('locationMessage', generateLocation(`https://google.com/maps?q=${coords.latitude},${coords.longlitude}`))
      callback()
    })
  });

server.listen(port, () => {
    console.log(`Server up on http://localhost:${port}/`);
})
