ig.module('game.entities.dragon-head').requires('impact.entity').defines(function() {

	EntityDragonHead = ig.Entity.extend({
		size: {
			x: 67,
			y: 41
		},
		animSheet: new ig.AnimationSheet('media/dragonHead.png', 67, 41),

		init: function(x, y, settings) {
			this.parent(x, y, settings);

			// Add the animations
			this.addAnim('idle', 1, [0]);
		}
	});

});

