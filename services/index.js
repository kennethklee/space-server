var http = require('./http'),
    websocket = require('./websocket'),
    space = require('./space');

// Setup services
module.exports = function(app, io) {
    http(app);
    websocket(io);
}