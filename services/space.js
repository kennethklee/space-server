var Box2D = require('box2dweb');

var init = function(world) {
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
    wall.shape.SetAsBox(1000, 10);
    staticDef.position.Set(0, 0);
    world.CreateBody(staticDef).CreateFixture(wall);

    // Bottom
    staticDef.position.Set(9990, 0);
    world.CreateBody(staticDef).CreateFixture(wall);

    // Left
    wall.shape.SetAsBox(10, 1000);
    staticDef.position.Set(0, 0);
    world.CreateBody(staticDef).CreateFixture(wall);

    // Right
    staticDef.position.Set(0, 9990);
    world.CreateBody(staticDef).CreateFixture(wall);
};

var Space = function() {
    var gravity = new Box2D.Common.Math.b2Vec2(0, 0);
    this.world = new Box2D.Dynamics.b2World(gravity, true);    // Allow sleep
    this.players = {};
    
    init(this.world);
};
module.exports = new Space();

Space.prototype.spawnPlayer = function(username, x, y) {
    var bodyDef = new Box2D.Dynamics.b2BodyDef(),
        playerDef = new Box2D.Dynamics.b2FixtureDef();
    
    bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    bodyDef.position.Set(x, y);
    playerDef.density = 1.0;
    playerDef.friction = 0.5;
    playerDef.restitution = 0.3;
    playerDef.shape = new Box2D.Collision.Shapes.b2CircleShape();
    playerDef.shape.SetRadius(10);
    
    var player = this.world.CreateBody(bodyDef).CreateFixture(playerDef);
    player.type = 'player';
    
    this.players[username] = player;
};

Space.prototype.destroyPlayer = function(username) {
    this.world.DestroyBody(this.players[username].GetBody());
};

Space.prototype.getPlayer = function(username) {
    return this.players[username];
};

Space.prototype.getState = function() {
    
};
