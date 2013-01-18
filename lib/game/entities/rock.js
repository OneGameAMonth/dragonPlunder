ig.module('game.entities.rock').requires('impact.entity').defines(function() {

	EntityRock = ig.Entity.extend({
		size: {
			x: 8,
			y: 8
		},
		isRock: true,
		crash: new ig.Sound('media/sfx/crash.*'),
		bounciness: 0.6,
		friction: { x: 50, y: 0 },

		type: ig.Entity.TYPE.B,
		// Evil enemy group
		checkAgainst: ig.Entity.TYPE.BOTH,
		// Check against friendly
		collides: ig.Entity.COLLIDES.PASSIVE,

		animSheet: new ig.AnimationSheet('media/tiles8.png', 8, 8),

		init: function(x, y, settings) {
			this.parent(x, y, settings);

			this.addAnim('idle', 1, [50]);
		},

		update: function() {
			this.parent();
		},

		collideWith: function(other, axis) {
			this.crash.play();
			this.kill();
		},

		handleMovementTrace: function(res) {
			if(res.collision.slope) {
				this.sign = this.sign || (Math.random() < 0.5 ? -1 : 1);
				this.vel.x = (Math.random() * 10 + 10) * this.sign;
			}
			this.parent(res);
		}
	});

});

