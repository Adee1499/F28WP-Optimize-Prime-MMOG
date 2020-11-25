const Bundler = require('parcel-bundler');
const app = require('express')();
const server = require('http').createServer(app);
const socketIO = require('socket.io');

let io = socketIO(server);

const file = 'src/client/html/game.html';
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

        console.log(socket.id + ' disconnected');
        playerIndex--;
        socket.broadcast.emit('player-connection', playerIndex);
        socket.broadcast.emit('removal', socket.pos);
    });
    socket.emit('player-number', socket.id)

    // Receive player positions and type
    socket.on('position', ({pos, bool, rot, scared}) => {
        // console.log(socket.id + `'s current position is ${pos}`);
        // emit to other players
        socket.broadcast.emit('position', ({pos, bool, rot, scared}));
    })


    //Receive pellet positions
    socket.on('pellets', currentFood => {
        socket.broadcast.emit('pellets', currentFood);

    })
    // Receive eaten powerpill position and broadcast to clients
    socket.on('powerpill', pos => {
        socket.broadcast.emit('powerpill', pos);
    })
})

