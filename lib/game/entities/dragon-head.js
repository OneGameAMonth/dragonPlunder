ig.module('game.entities.dragon-head').requires('impact.entity').defines(function() {

	EntityDragonHead = ig.Entity.extend({
		size: {
			x: 72,
			y: 50
		},
		offset: {
			x: 0,
			y: 26
		},
		collides: ig.Entity.COLLIDES.FIXED,
		animSheet: new ig.AnimationSheet('media/dragonHead.png', 72, 76),

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0]);
		}
	});

});



