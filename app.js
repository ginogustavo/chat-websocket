const express = require('express')
const socketio = require('socket.io')
const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.get('/', (req, res)=> {
    res.render('index')
})
const server = app.listen(process.env.PORT || 3000, () => {
    console.log("Gait server is running")
})


//Initialize socket for the server
//const io = socketio(server)
const io = socketio(server, {transports: ['websocket']})
io.on('connect', socket => {
    console.log('New client connected')
    socket.username = "Anonymous"
    socket.on('change_username', data =>{
        socket.username = data.username
    })

    //handle the new message event
    socket.on('new_message', data => {
        console.log('new_message')
        io.sockets.emit('receive_message', {message: data.message, username: socket.username})
    })

    //handling typing
    socket.on('typing', data => {
        socket.broadcast.emit('typing', {username: socket.username})
    })
})