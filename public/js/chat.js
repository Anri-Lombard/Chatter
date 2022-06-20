const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationUrlTemplate = document.querySelector('#location-url-template').innerHTML

// Options
const { username, roomname } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('countUpdated', (count) => {
    console.log('Count has been updated', count);
})

socket.on('locationMessage', (url) => {
    console.log(url);
    const html = Mustache.render(locationUrlTemplate, {
        url: url.url,
        createdAt: moment(url.createdAt).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // disable
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.messageToSend.value

    socket.emit('sendMessage', message, (error) => {
        // enable
        $messageFormButton.removeAttribute('disabled')
        // clear input and focus
        $messageFormInput.value = ''
        $messageFormInput.focus()
        
        if (error) {
            console.log(error);
        } else {
            console.log("Message Delivered!");
        }
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) 
        return alert("Geolocation is not supported for your browser.")
    
    // disable
    $sendLocationButton.setAttribute('disabled', 'disabled')
    
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longlitude: position.coords.longitude
        }, () => {
            console.log("Location Shared!");

            // enable 
            $sendLocationButton.removeAttribute('disabled')
        })
    })
})

socket.emit('join', { username, roomname })