/*jshint esversion: 6, node: true*/
const Hapi = require('hapi');
const Inert = require('inert');
const Path = require('path');
const SocketIO = require('socket.io');

const server = new Hapi.Server();
let io;

server.connection({
    host: 'localhost',
    port: Number(process.argv[2] || 8080)
});

server.register(Inert, err => {
    if (err) {
        throw err;
    }
});

server.route({
    path: '/',
    method: 'GET',
    handler: {
        file: Path.join(__dirname, 'index.html')
    }
});

server.start(_ => {
    console.log('Server started on ' + server.info.uri);

    // listener - the http/hapi server object.
    io = SocketIO.listen(server.listener);

    io.on('connection', (socket) => {

        console.log('a user connected');

        socket.on('disconnect', _ => {
            console.log('user disconnected');
        });

        socket.on('chat message', (msg) => {
            io.emit('chat message', msg);
            console.log('message: ' + msg);
        });
    });
});
