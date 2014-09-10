var space = require('./space'),
    log = require('debug')('game:websocket');

// #Setup WebSocket service
// ## Incoming messages
// * login - client enters a game
// * disconnect - client leaves
// * keyboard state - keyboard changes (up, down, left, right)
//
// ## Outgoing messages
// * system message - message from the server
// * user message - message from a user
// * game state - state of current game
module.exports = function(io) {
    var players = {};

    io.on('connection', function(socket) {
        socket.on('login', function(username) {
            var x = randomBetween(space.boundry.padding, space.boundry.width - space.boundry.padding),
                y = randomBetween(space.boundry.padding, space.boundry.height - space.boundry.padding);

            log('Socket, "%s" logged in', username);

            // TODO check duplicates
            socket.username = username;
            socket.player = space.spawnPlayer(username, x, y);
            io.emit('system message', username + ' joined the server.');
        });

        socket.on('disconnect', function() {
            if (socket.username) {
                space.destroyPlayer(socket.username);
                delete players[socket.username];
                log('Socket, "%s" disconnected', socket.username);
                io.emit('system message', socket.username + ' left the server.');
            }
        });

        socket.on('keyboard state', function(state) {
            // Turn, accelerate, fire
            if (state.left) {   // Rotate

            }
        });
    });
};

// Helpers
var randomBetween = function(min, max) {
    return Math.round((Math.random() * (max - min)) + min);
};
