ig.module('game.entities.dragon-nose').requires('impact.entity').defines(function() {

	EntityDragonNose = ig.Entity.extend({
		size: {
			x: 25,
			y: 11
		},
		offset: {
			x: 0,
			y: 11
		},
		collides: ig.Entity.COLLIDES.FIXED,
		animSheet: new ig.AnimationSheet('media/dragonNose.png', 25, 22),

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0]);
		}
	});

});


