ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	
	'game.entities.player',
	'game.entities.spike',
	'game.entities.crumble',
	'game.levels.test'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	gravity: 300, // All entities are affected by this
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	
	init: function() {
		// Bind keys
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.X, 'jump' );
		ig.input.bind( ig.KEY.C, 'shoot' );
		
		// Load the LevelTest as required above ('game.level.test')
		this.loadLevel( LevelTest );
	},
	
	crumbleLevel: 30,

	update: function() {		
		// Update all entities and BackgroundMaps
		this.parent();
		
		// screen follows the player
		var player = this.getEntitiesByType( EntityPlayer )[0];
		if( player ) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;

			if(player.pos.y > 8 * 40 || player.pos.y < -8) {
				window.location.href = window.location.href;
			}
		}

		this.doCrumble();
	},

	doCrumble: function() {
		if(this.crumbleLevel < 0) {
			return;
		}

		var map = this.getMap('main').data;

		if(!map[this.crumbleLevel] || map[this.crumbleLevel].filter(function(t) { return t !== 0 }).length === 0) {
			// current crumble is done, set up for next
			this.crumbleDelay = Math.random() + 0.2;
			--this.crumbleLevel;
		}

		if(this.crumbleDelay > 0) {
			this.crumbleDelay -= ig.system.tick;
			return;
		}
	
		var x;
		while(!x) {
			i = (Math.random() * this.collisionMap.data[this.crumbleLevel].length) | 0;
			x = this.collisionMap.data[this.crumbleLevel][i];
		}

		this.crumbleAt(i, this.crumbleLevel);
		this.crumbleDelay = Math.random() / 2;
	},
	
	draw: function() {
		// Draw all entities and BackgroundMaps
		this.parent();
		
		this.font.draw( 'Arrow Keys, X, C', 2, 2 );
	},

	crumbleAt: function(x, y) {
		this.getMap('main').data[y][x] = 0;
		this.collisionMap.data[y][x] = 0;
		this.spawnEntity(EntityCrumble, x * 8, y * 8);
	},

	getMap: function(name) {
		return this.backgroundMaps.filter(function(m) { return m.name === name })[0];
	}
});


// Start the Game with 60fps, a resolution of 240x160, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 240, 160, 2 );

});
