var Box2D = require('box2dweb'),
    Ship = require('./ship'),
    log = require('debug')('game:space');

// Helper function to construct the world
var init = function(world, width, height, padding) {
    var staticDef = new Box2D.Dynamics.b2BodyDef();
    staticDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

    // Let's just put a static box around everything for now (1000x1000)

    // Create a static wall
    var wall = new Box2D.Dynamics.b2FixtureDef();
    wall.density = 1.0;
    wall.friction = 0.5;
    wall.restitution = 0.3;
    wall.shape = new Box2D.Collision.Shapes.b2PolygonShape();

    // Top
    wall.shape.SetAsBox(width, padding);
    staticDef.position.Set(0, 0);
    world.CreateBody(staticDef).CreateFixture(wall);

    // Bottom
    staticDef.position.Set(width - padding, 0);
    world.CreateBody(staticDef).CreateFixture(wall);

    // Left
    wall.shape.SetAsBox(padding, height);
    staticDef.position.Set(0, 0);
    world.CreateBody(staticDef).CreateFixture(wall);

    // Right
    staticDef.position.Set(0, height - padding);
    world.CreateBody(staticDef).CreateFixture(wall);
};

var Space = function() {
    var gravity = new Box2D.Common.Math.b2Vec2(0, 0);

    this.updatedAt = new Date().getTime();
    this.world = new Box2D.Dynamics.b2World(gravity, true);    // Allow sleep
    this.players = [];
    // TODO make as options
    this.boundry = {
        width: 1000,
        height: 1000,
        padding: 10
    };

    init(this.world, this.boundry.width, this.boundry.height, this.boundry.padding);
    log('World has been created');

    this.interval = setInterval(this.update, 1000 / 60);
};

Space.prototype.update = function() {
    var currentTime = new Date().getTime(),
        deltaTime = currentTime - this.updatedAt
        usernames = Object.keys(this.players);

    // Update players
    for (var i = 0; i < usernames.length; i++) {
        this.players[usernames[i]].update();
    }

    // Update world
    module.exports.world.Step(deltaTime / 1000, 10, 10);    // time, velocity, position
    module.exports.world.ClearForces();
    this.updatedAt = new Date().getTime();
};

Space.prototype.spawnPlayer = function(username, x, y) {
    var ship = new Ship(this.world, x, y);

    this.players[username] = ship;
    log('Player, "%s", spawned at (%d, %d)', username, x, y);

    return ship;
};

Space.prototype.destroyPlayer = function(username) {
    this.players[username].destroy();

    delete this.players[username];
    log('Player, "%s", destroyed', username);
};

Space.prototype.getPlayer = function(username) {
    return this.players[username];
};

Space.prototype.getMapState = function() {
    // TODO map
    return this.boundry;
};

Space.prototype.getPlayerStates = function(userList) {
    var serializedPlayers = {},
        usernames = userList || Object.keys(this.players);
    for(var i = 0; i < usernames.length; i++) {
        var username = usernames[i],
            player = this.players[username],
            body = player.fixture.GetBody(),
            position = body.GetPosition(),
            linearVelocity = body.GetLinearVelocity();

        serializedPlayers[username] = {
            type: player.type,
            position: position,
            linearVelocity: linearVelocity
        };
    }

    return serializedPlayers;
};

module.exports = new Space();
