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

io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
