var app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    services = require('./services');   

// Setup services
services(app, io);

// Start server
app.set('port', process.env.PORT || 3000);
server.listen(app.get('port'), function() {
    console.log('Server started on port %d', app.get('port'));
});