const users = []

const addUser = ({ id, username, roomname }) => {
    // clean
    username = username.trim().toLowerCase();
    roomname = roomname.trim().toLowerCase();

    // validate
    if (!username || !roomname) {
        return {
            error: "Username and room are required!"
        }
    }

    // Check for existing users
    const existingUser = users.find((user) => {
        return user.roomname === roomname && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: "Username is in use!"
        }
    }

    // Store user
    const user = { id, username, roomname }
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

const getUsersInRoom = (roomname) => {
    roomname = roomname.trim().toLowerCase()
    const usersInRoom = users.filter((user) => user.roomname === roomname)
    return usersInRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}