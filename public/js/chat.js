const socket = io()

socket.on('countUpdated', (count) => {
    console.log('Count has been updated', count);
})

socket.on('message', (welcomeMessage) => {
    console.log(welcomeMessage);
})

document.querySelector('#increment').addEventListener('click', () => {
    console.log("Clicked");

    socket.emit('increment')
})