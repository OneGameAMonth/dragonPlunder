ig.module('game.entities.dragon-nose').requires('impact.entity').defines(function() {

	EntityDragonNose = ig.Entity.extend({
		size: {
			x: 43,
			y: 26
		},
		offset: {
			x: 0,
			y: 20
		},
		collides: ig.Entity.COLLIDES.FIXED,
		animSheet: new ig.AnimationSheet('media/dragonNose.png', 43, 46),

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0]);
		}
	});

});


