ig.module(
	'game.entities.treasure'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityTreasure = ig.Entity.extend({
	size: {x: 16, y: 16 },
	pickedUp: new ig.Sound('media/sfx/treasure.*'),
	
	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	animSheet: new ig.AnimationSheet( 'media/tiles8.png', 16, 16 ),
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 1, [7] );
		this.addAnim( 'falling', 1, [8] );
		this.initialY = y;
	},

	update: function() {
		this.parent();

		if(this.pos.y >= this.initialY + 1) {
			this.currentAnim = this.anims.falling;
		}
	},
	
	check: function( other ) {
		if(other.isPlayer && other.standing) {
			ig.game.gold += 100;
			this.kill();
			this.pickedUp.play();
		}
	}
});

});

