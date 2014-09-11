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
// * player state - state of all players in current game
// * map state - state of map, transmitted upon connection
module.exports = function(io) {
    var players = {};

    io.on('connection', function(socket) {
        log('Socket connection, %s', socket.id);

        socket.on('login', function(username) {
            var x = randomBetween(space.boundry.padding, space.boundry.width - space.boundry.padding),
                y = randomBetween(space.boundry.padding, space.boundry.height - space.boundry.padding);

            log('Socket, %s logged in as "%s"', socket.id, username);

            // TODO check duplicates
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

    // Update state every second
    setInterval(function() {
        io.emit('player state', space.getPlayerStates());
    }, 1000);
};

// Helpers
var randomBetween = function(min, max) {
    return Math.round((Math.random() * (max - min)) + min);
};
