const express = require('express')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);
const port = process.env.PORT || 3000
app.use('/', express.static('static/'))
app.use('/g/:id', express.static('static/'))

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
