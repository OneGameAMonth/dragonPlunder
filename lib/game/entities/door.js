ig.module('game.entities.door').requires('impact.entity').defines(function() {

	EntityDoor = ig.Entity.extend({
		size: {
			x: 16,
			y: 32
		},
		animSheet: new ig.AnimationSheet('media/door.png', 16, 32),

		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0]);
		}
	});

});





