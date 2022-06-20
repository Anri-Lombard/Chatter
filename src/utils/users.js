const users = []

const addUser = ({ id, username, room }) => {
    // clean
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // validate
    if (!username || !room) {
        return {
            error: "Username and room are required!"
        }
    }

    // Check for existing users
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: "Username is in use!"
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index != -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    const user = users.find((user) => user.id === id)
    return user
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const usersInRoom = users.filter((user) => user.room === room)
    return usersInRoom
}

addUser({
    id: 22,
    username: "Anri",
    room: "SA"
})

addUser({
    id: 23,
    username: "Anris",
    room: "SA"
})