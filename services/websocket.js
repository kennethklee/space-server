var space = require('./space'),
    log = require('debug')('game:websocket');

// #Setup WebSocket service
// ## Incoming messages
// * login - client enters a game
// * disconnect - client leaves
// * movement state - keyboard changes (up, down, left, right)
// * action state - key press triggers (fire)
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

        socket.on('login', function(username) {
            var x = randomBetween(space.boundry.padding, space.boundry.width - space.boundry.padding),
                y = randomBetween(space.boundry.padding, space.boundry.height - space.boundry.padding);

            log('Socket, %s logged in as "%s"', socket.id, username);

            // TODO reject duplicates
            socket.username = username;
            socket.player = space.spawnPlayer(username, x, y);
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

        socket.on('keyboard state', function(state) {
            // Turn, accelerate, fire
            if (state.left) {   // Rotate

            }
        });

        socket.emit('map state', space.getMapState());
    });

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
