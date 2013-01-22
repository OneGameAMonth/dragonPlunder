ig.module('game.entities.above-ground').requires('impact.entity').defines(function() {

	EntityAboveGround = ig.Entity.extend({
		size: {
			x: 256,
			y: 112
		},
		animSheet: new ig.AnimationSheet('media/aboveGround.png', 256, 112),

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0]);
		}
	});

});




