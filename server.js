const express = require('express');
const http = require('http');
// const socketIo = require('socket.io');
const { v4: uuidV4 } = require('uuid');


const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
});

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });
});

io.on('connection', socket => {
    console.log(`${socket.id} joined`);

    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
        })
    })
})

port = process.env.PORT || 3007;

server.listen(port, () => {
    console.log(`Server Started on ${port}`);
})