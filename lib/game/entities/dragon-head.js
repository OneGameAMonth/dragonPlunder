ig.module('game.entities.dragon-head').requires('impact.entity').defines(function() {

	EntityDragonHead = ig.Entity.extend({
		size: {
			x: 42,
			y: 25
		},
		offset: {
			x: 0,
			y: 16
		},
		collides: ig.Entity.COLLIDES.FIXED,
		animSheet: new ig.AnimationSheet('media/dragonHead.png', 42, 41),

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0]);
		}
	});

});



