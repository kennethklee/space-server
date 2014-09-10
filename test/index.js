var app = require('../index'),
    should = require('should'),
    ioc = require('socket.io-client');

describe('Server', function() {

    describe('Client', function() {
        var USERNAME = 'test user',
            client;

        before(function(next) {
            client = ioc('ws://0.0.0.0:3000');
            client.on('connect', function() {
                client.emit('login', USERNAME);
            });

            client.on('system message', function(message) {
                message.should.equal(USERNAME + ' joined the server.');
                next();
            });
        });

        after(function(done) {
            client.disconnect(true);
            done();
        });

        it('Login should spawn a player', function(done) {
            done();
        });
    });

});
