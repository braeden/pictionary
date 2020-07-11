const express = require('express')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);
const ID_SIZE = 4
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
    console.log(`[${io.engine.clientsCount}] a user connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`[${io.engine.clientsCount}] a user disconnected: ${socket.id}`);
    });

    let room = () => Object.keys(socket.rooms).filter(r => r != socket.id)

    socket.on('askRoom', data => {
        const id = [...Array(ID_SIZE)].map(() => Math.random().toString(36)[2]).join('')
        const room = (data && io.sockets.adapter.rooms[data]) ? data : id
        socket.join(room)
        socket.emit('givenRoom', room)
    })

    socket.on('draw', data => {
        socket.to(room()).emit('draw', data);
    })

    socket.on('requestSync', () => {
        io.in(room()).clients((err, clients) => {
            const [target] = clients.filter(client => client != socket.id)
            if (target) {
                socket.to(target).emit('requestSync', {
                    requestID: socket.id
                })
            }
        })
    })

    socket.on('drawSync', data => {
        if (data && data.requestID && data.draws) {
            socket.to(data.requestID).emit('drawSync', data.draws || [])
            console.log(`Transmitted: ${data.draws.length}`)
        }
    })

});

http.listen(port, () => console.log(`Started at port ${port}`))