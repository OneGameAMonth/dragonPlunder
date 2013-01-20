ig.module('game.entities.rock').requires('impact.entity', 'plugins.center').defines(function() {

	EntityRock = ig.Entity.extend({
		size: {
			x: 8,
			y: 8
		},

		isRock: true,
		crash: new ig.Sound('media/sfx/crash.*'),
		gravityFactor: 0,

		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.BOTH,
		collides: ig.Entity.COLLIDES.FIXED,

		animSheet: new ig.AnimationSheet('media/tiles8.png', 8, 8),

		init: function(x, y, settings) {
			this.parent(x, y, settings);

			this.addAnim('idle', 1, [50]);

			this.timer = new ig.Timer(this.fallAfter);
		},

		update: function() {
			this.parent();

			if(this.timer.delta() > 0) {
				this.gravityFactor = 1;
			}
		},

		collideWith: function(other, axis) {
			if(other.isPlayer) {
				other.receiveDamage(1);
				this.kill();
			}
		},

		die: function() {
			// switch to an explosion animation of some sort
			this.fireEvent('death', this);
			this.kill();
		},

		handleMovementTrace: function(res) {
			if(res.collision.slope || res.collision.y) {
				this.die();
				return;
			}
			this.parent(res);
		}
	});

	EntityRock.inject(MixinCenter);
});

