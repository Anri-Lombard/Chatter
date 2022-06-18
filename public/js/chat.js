const socket = io()

socket.on('countUpdated', (count) => {
    console.log('Count has been updated', count);
})

socket.on('message', (welcomeMessage) => {
    console.log(welcomeMessage);
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.messageToSend.value

    socket.emit('sendMessage', message)
})

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) 
        return alert("Geolocation is not supported for your browser.")
    
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
    })
})