ig.module('game.entities.dragon-body').requires('impact.entity').defines(function() {

	EntityDragonBody = ig.Entity.extend({
		size: {
			x: 256,
			y: 240
		},
		offset: {
			x: 0,
			y: 0
		},
		animSheet: new ig.AnimationSheet('media/dragonBody.png', 256, 240),

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0]);
		}
	});
});




