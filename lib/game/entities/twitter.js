ig.module(
	'game.entities.twitter'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityTwitter = ig.Entity.extend({
	size: {x: 8, y: 8 },
	zIndex: 10000,
	
	animSheet: new ig.AnimationSheet( 'media/tiles8.png', 8, 8 ),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 1, [90] );

		ig.input.initMouse();

		if(!window.wm) {
			ig.system.canvas.addEventListener('click', this._onCanvasClick.bind(this));
		}
	},

	_onCanvasClick: function() {
		if(this.inFocus()) {
			window.open('http://twitter.com/cityfortyone');
		}
	},

	inFocus: function() {
			return (
				 (this.pos.x <= (ig.input.mouse.x + ig.game.screen.x)) &&
				 ((ig.input.mouse.x + ig.game.screen.x) <= this.pos.x + this.size.x) &&
				 (this.pos.y <= (ig.input.mouse.y + ig.game.screen.y)) &&
				 ((ig.input.mouse.y + ig.game.screen.y) <= this.pos.y + this.size.y)
			);
	 }
});

});


