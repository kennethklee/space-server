var Box2D = require('box2dweb'),
    log = require('debug')('game:ship');

var Ship = module.exports = function(world, x, y) {
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

    this.world = world;
    this.fixture = world.CreateBody(bodyDef).CreateFixture(playerDef);
    this.type = 'player';
};

Ship.prototype.destroy = function() {
    this.world.DestroyBody(this.fixture.GetBody());
};

Ship.prototype.applyThrust = function(vx, vy) {
    // Current State
    var body = this.fixture.GetBody(),
        velocity = body.GetLinearVelocity();

    // Calculate Delta
    // TODO: Limit angular speed per ship
    // TODO: Ship should have max speed
    var deltaVelocityX = (vx < 0) ? Math.max(velocity.x - 1, vx) : Math.min(velocity.x + 1, vx),
        deltaVelocityY = (vy < 0) ? Math.max(velocity.y - 1, vy) : Math.min(velocity.y + 1, vy);

    // Calculate Force
    var impulseX = body.GetMass() * deltaVelocityX,
        impulseY = body.GetMass() * deltaVelocityY,
        impulse = new Box2D.Common.Math.b2Vec2(impulseX, impulseY);

    body.ApplyImpulse(impulse, body.GetWorldCenter());
};
