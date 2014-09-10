var http = require('./http'),
    websocket = require('./websocket');

// Setup services
module.exports = function(app, io) {
    http(app);
    websocket(io);
}