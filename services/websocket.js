var space = require('./space');

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
       console.log('a user connected');
        
        socket.on('login', function(username) {
            // TODO check duplicates
            socket.username = username;
            socket.player = space.spawnPlayer(username);
            io.emit('system message', username + ' joined the server.');
        });
        
        socket.on('disconnect', function() {
            if (socket.username) {
                space.destroyPlayer(username);
                delete players[socket.username];
                io.emit('system message', username + ' left the server.');
            }
        });
        
        socket.on('keyboard state')
    });
    
};