var app = require('../index'),
    should = require('should'),
    ioc = require('socket.io-client');

describe('Server', function() {

    describe('Space', function() {
        it('should spawn a player and destroy it', function(done) {
            app.space.spawnPlayer('test', 500, 500);
            app.space.players.should.have.property('test');
            var position = app.space.players.test.GetBody().GetPosition();
            position.x.should.equal(500);
            position.y.should.equal(500);

            app.space.destroyPlayer('test');
            app.space.players.should.not.have.property('test');

            done();
        });
    });

    describe('Websocket', function() {

        describe('Single Client', function() {
            var client;

            beforeEach(function(next) {
                client = new ioc('ws://0.0.0.0:3000', {forceNew: true});
                next();
            });

            afterEach(function(next) {
                if (client && client.connected) {
                    client.disconnect(true);
                    next();
                }
            });

            it('should send map upon connection', function(done) {
                client.on('map state', function(mapState) {
                    should.exist(mapState);
                    done();
                });
            });

            it('should send system message when login', function(done) {
                var USERNAME = 'test user ' + Math.random();

                client.on('connect', function() {
                    client.emit('login', USERNAME);
                });

                client.on('system message', function(message) {
                    message.should.equal(USERNAME + ' joined the server.');
                    done();
                });
            });
        });
    });

});
