const Bundler = require('parcel-bundler');
const app = require('express')();
const server = require('http').createServer(app);
const socketIO = require('socket.io');

let io = socketIO(server);

// direct to game page for testing
const file = 'src/client/html/game.html';
// const file = 'src/client/html/index.html;
const options = {};

const bundler = new Bundler(file, options);

app.use(bundler.middleware());

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});

// Keep track of number of players connected
let playerIndex = 0;

io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);
    playerIndex++;
    socket.broadcast.emit('player-connection', playerIndex);
    socket.on('disconnect', () => {
        console.log('user disconnected');
        playerIndex--;
        socket.broadcast.emit('player-connection', playerIndex);
    });
    socket.emit('player-number', socket.id);

    // Receive player positions
    socket.on('position', pos => {
        // console.log(socket.id + `'s current position is ${pos}`);

        // emit to other players
        socket.broadcast.emit('position', pos);
    })
});
