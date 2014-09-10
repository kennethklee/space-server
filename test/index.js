var app = require('../index'),
    should = require('should'),
    ioc = require('socket.io-client');

describe('Server', function() {
    it('Login should spawn a player', function(done) {
        var client = ioc('ws://0.0.0.0:3000'),
            USERNAME = 'login test';

        client.on('connect', function() {
            client.emit('login', USERNAME);
        });

        client.on('system message', function(message) {
            message.should.equal(USERNAME + ' joined the server.');
            app.space.players.should.have.property(USERNAME);
            done();
        });
    });
});
