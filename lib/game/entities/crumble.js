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
	
	animSheet: new ig.AnimationSheet( 'media/tiles8.png', 8, 8 ),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		var offset = 0;
		if(this.small) {
			offset = 10;
		}
		var o = offset;
		this.addAnim( 'crumble', 1, [10 + o, 10 + o, 11 + o, 12 + o, 13 + o], true );
	},
	
	update: function() {
		this.parent();
		if(this.currentAnim.frame >= 2) {
			this.collides = ig.Entity.COLLIDES.NONE;
			this.gravityFactor = 1;
			this.handleMovementTrace = this.alwaysFall;
		}
		if(this.currentAnim.frame >= 4) {
			this.kill();
		}
	},

	alwaysFall: function( res ) {
    this.pos.x += this.vel.x * ig.system.tick;
    this.pos.y += this.vel.y * ig.system.tick;
	}
});

});

