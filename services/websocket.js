var space = require('../entities/space'),
    log = require('debug')('game:websocket');

// #Setup WebSocket service
// ## Incoming messages
// * login - client enters a game
// * disconnect - client leaves
// * movement change - movement key state changes (movement state)
// * fire - fire key press
// * aspect change - visual feature changes (distant player destroy sounds)
//
// ## Outgoing messages
// * system message - message from the server
// * user message - message from a user
// * heartbeat sync - complete state of current game
// * delta sync - changes in the world
// * map state - state of map, transmitted upon connection
module.exports = function(io) {
    var players = {},   // All players
        deltaQueue = {};    // All delta players

    io.on('connection', function(socket) {
        log('Socket connection, %s', socket.id);
        socket.emit('map state', space.getMapState());

        socket.on('login', function(username) {
            var x = randomBetween(space.boundry.padding, space.boundry.width - space.boundry.padding),
                y = randomBetween(space.boundry.padding, space.boundry.height - space.boundry.padding);

            log('Socket, %s logged in as "%s"', socket.id, username);

            // TODO reject duplicates
            socket.username = username;
            socket.player = players[username] = space.spawnPlayer(username, x, y);
            io.emit('system message', username + ' joined the server.');
        });

        socket.on('disconnect', function() {
            if (socket.username) {
                space.destroyPlayer(socket.username);
                delete players[socket.username];
                io.emit('system message', socket.username + ' left the server.');
            }
            log('Socket disconnection, %s', socket.id);
        });

        socket.on('movement change', function(state) {
            deltaQueue[socket.username] = true; // Mark as changed

            socket.player.setState(state);
        });

        socket.on('fire', function(state) {
            deltaQueue[socket.username] = true; // Mark as changed

            // TODO Fire
        });

        // TODO: this should be recieved as unreliable packets
        socket.on('aspect change', function(state) {
            // Totally going to ignore this for now
        });
    });

    // TODO: send as unreliable packets
    // TODO: pack before sending

    // Delta sync every "frame" @ 15fps
    setInterval(function() {
        var deltaPlayers = Object.keys(deltaQueue);
        io.emit('delta sync', {
            timestamp: new Date(),
            players: space.getPlayerStates(deltaPlayers)
        });
        deltaQueue = {};
    }, 1000/15);

    // Heartbeat every 5 seconds, our "quiet" time
    setInterval(function() {
        log('heartbeat - player states sent');
        io.emit('heartbeat sync', {
            timestamp: new Date(),
            players: space.getPlayerStates()
        });
    }, 5000);
};

// Helpers
var randomBetween = function(min, max) {
    return Math.round((Math.random() * (max - min)) + min);
};
