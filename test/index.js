var app = require('../index'),
    should = require('should'),
    ioc = require('socket.io-client');

describe('Server', function() {

    describe('Space', function() {
        it('should spawn a player and destroy it', function(done) {
            app.space.spawnPlayer('test', 500, 500);
            app.space.players.should.have.property('test');
            var position = app.space.getPlayer('test').fixture.GetBody().GetPosition();
            position.x.should.equal(500);
            position.y.should.equal(500);

            app.space.destroyPlayer('test');
            app.space.players.should.not.have.property('test');

            done();
        });
    });

    describe('Ship', function() {
        var ship;

        beforeEach(function() {
            ship = app.space.spawnPlayer('test', 500, 500);
        });

        afterEach(function() {
            ship = null;
            app.space.destroyPlayer('test');
        });

        it('should apply thrust and move forward', function(done) {
            ship.setState({up: true});

            // Let's check in a bit
            setTimeout(function() {
                var state = app.space.getPlayerStates().test;
                state.position.x.should.equal(500);
                state.position.y.should.be.greaterThan(500);

                done();
            }, 200);
        });

        it('should turn', function(done) {
            ship.setState({right: true});

            // Let's check in a bit
            setTimeout(function() {
                var state = app.space.getPlayerStates().test;
                state.position.x.should.equal(500);
                state.position.y.should.equal(500);
                state.heading.should.be.greaterThan(0);
                done();
            }, 200);
        });

        it('should turn left and thrust', function(done) {
            ship.setState({up: true, left: true});

            // Let's check in a bit
            setTimeout(function() {
                var state = app.space.getPlayerStates().test;
                state.position.x.should.be.lessThan(500);
                state.position.y.should.be.greaterThan(500);
                state.heading.should.be.lessThan(0);
                done();
            }, 200);
        });
        
        it('should turn right and reverse', function(done) {
            ship.setState({down: true, right: true});

            // Let's check in a bit
            setTimeout(function() {
                var state = app.space.getPlayerStates().test;
                state.position.x.should.be.lessThan(500);
                state.position.y.should.be.lessThan(500);
                state.heading.should.be.greaterThan(0);
                done();
            }, 200);
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

            it('should get player states in heartbeats', function(done) {
                client.on('delta sync', function(state) {
                    state.should.have.property('timestamp');
                    state.should.have.property('players');
                    done();
                });
            });

            it('should get world state heartbeats', function(done) {
                this.timeout(5000);
                client.on('heartbeat sync', function(state) {
                    state.should.have.property('timestamp');
                    state.should.have.property('players');
                    done();
                });
            });

        });
    });

});
