const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const { generateMessage, generateLocation } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0;

io.on("connection", (socket) => {
    console.log("New WebSocket Connection");

    socket.on('join', (options, callback) => {
      const { error, user } = addUser({ id: socket.id, ...options })

      if (error) {
        callback(error)
      }

      socket.join(user.roomname)

      socket.emit('message', generateMessage("Welcome!"))
      socket.broadcast.to(user.roomname).emit('message', generateMessage(`${user.username} has joined!`))

      callback()
    })

    socket.on("sendMessage", (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback("Profanity is not allowed!")
        }

        io.emit('message', generateMessage(message))
        callback('Delivered!')
    })

    socket.on("disconnect", () => {
      const user = removeUser(socket.id)

      if (user) {
        io.to(user.roomname).emit('message', generateMessage(`${user.username} has left!`))
      }
    })

    socket.on("sendLocation", (coords, callback) => {
      io.emit('locationMessage', generateLocation(`https://google.com/maps?q=${coords.latitude},${coords.longlitude}`))
      callback()
    })
  });

server.listen(port, () => {
    console.log(`Server up on http://localhost:${port}/`);
})
