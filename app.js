// const express = require('express')
// const app = express();
// var http = require('http').createServer(app);
// var io = require('socket.io')(http);

// https://tsh.io/blog/how-to-write-video-chat-app-using-webrtc-and-nodejs/

const express = require('express')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);
const port = process.env.PORT || 3000
app.use('/', express.static('static/'))
app.use('/g/:id', express.static('static/'))

// app.use('/', express.static('static'))
//serve statically at / => establish connection w/ sockets => then change url without redirect w/ game uuid =>

// app.get('/', (req, res) => {
//     const id = Math.random().toString(36).substring(2, 7)
//     serverRooms[id] = true;
//     res.redirect(`/game/${id}`);
// });

// app.get('/game/:id', (req, res) => {
//     console.log("y",req.params.id)
//     if (serverRooms[req.params.id] && req.params.id) {
//         res.sendFile('static/index.html', {
//             root: __dirname
//         });
//     } else {
//         res.redirect('/')
//     }
// });

// The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
    res.status('404')
    res.sendFile('static/404.html', {
        root: __dirname
    });
});



io.on('connection', (socket) => {

    socket.join('')
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('askRoom', data => {
        const id = Math.random().toString(36).substring(2, 7)
        const room = (data && io.sockets.adapter.rooms[data]) ? data : id
        socket.join(room)
        socket.emit('givenRoom', room)
    })

    socket.on('draw', data => {
        const room = Object.keys(socket.rooms).filter(s => s.length == 5)
        socket.to(room).emit('draw', data);
    })

});


http.listen(port, () => console.log(`Started at port ${port}`))

// var express = require('express')
// var app = express();
// var http = require('http').createServer(app);
// var io = require('socket.io')(http);

// app.use('/', express.static('static'))


// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/static/index.html');
// });

// io.on('connection', (socket) => {
//   console.log('a user connected');
// });

// http.listen(3000, () => {
//   console.log('listening on *:3000');
// });