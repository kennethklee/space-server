var Box2D = require('box2dweb'),
    __ = require('underscore'),
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

    this.heading = 0    // Radians
    this.turnSpeed = 0.261799388    // About 15 degrees
    this.acceleration = 10
};

Ship.prototype.destroy = function() {
    this.world.DestroyBody(this.fixture.GetBody());
};

Ship.prototype.setState = function(state) {
    // TODO ensure only used states
    __.extend(this.state, state);
};

Ship.prototype.update = function() {
    if (this.state.left) {
        this.heading -= this.turnSpeed;
    }
    if (this.state.right) {
        this.heading += this.turnSpeed;
    }
    if (this.state.up) {
        this.applyThrust(Math.cos(this.acceleration), Math.sin(this.acceleration));
    }
    if (this.state.down) {
        var heading = this.heading + 3.14159265;    // Reverse
        this.applyThrust(Math.cos(heading) * this.acceleration * 0.5, Math.sin(heading) * this.acceleration * 0.5);
    }
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
