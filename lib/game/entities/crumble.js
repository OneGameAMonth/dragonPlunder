ig.module(
	'game.entities.crumble'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityCrumble = ig.Entity.extend({
	
	size: {x: 8, y:8},
	gravityFactor: 0,
	
	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.FIXED,
	
	animSheet: new ig.AnimationSheet( 'media/tiles.png', 8, 8 ),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'crumble', 1, [8, 8, 12, 16, 20], true );
	},
	
	update: function() {
		this.parent();
		if(this.currentAnim.frame >= 2) {
			this.collides = ig.Entity.COLLIDES.NONE;
		}
		if(this.currentAnim.frame > 2) {
			this.kill();
		}
	}
});

});

