var Box2D = require('box2dweb'),
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
    var invFrameRate = 1/60,
        gravity = new Box2D.Common.Math.b2Vec2(0, 0);

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
    var invFrameRate = 1/60;
    module.exports.world.Step(invFrameRate, 10, 10);    // time, velocity, position
    module.exports.world.ClearForces();
};

Space.prototype.spawnPlayer = function(username, x, y) {
    var bodyDef = new Box2D.Dynamics.b2BodyDef(),
        playerDef = new Box2D.Dynamics.b2FixtureDef();

    bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    bodyDef.position.Set(x, y);
    bodyDef.fixedRotation = false;
    playerDef.density = 1.0;
    playerDef.friction = 0.5;
    playerDef.restitution = 0.3;
    playerDef.shape = new Box2D.Collision.Shapes.b2CircleShape();
    playerDef.shape.SetRadius(10);

    var player = this.world.CreateBody(bodyDef).CreateFixture(playerDef);
    player.type = 'player';

    this.players[username] = player;
    log('Player, "%s", spawned at (%d, %d)', username, x, y);
};

Space.prototype.destroyPlayer = function(username) {
    this.world.DestroyBody(this.players[username].GetBody());

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
            body = player.GetBody(),
            position = body.GetPosition(),
            linearVelocity = body.GetLinearVelocity();

        serializedPlayers[username] = {
            type: player.type,
            position: [position.x, position.y],
            linearVelocity: [linearVelocity.x, linearVelocity.y]
        };
    }

    return serializedPlayers;
};

module.exports = new Space();
