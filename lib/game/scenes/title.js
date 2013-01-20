ig.module('game.scenes.title').
requires(
	'impact.game', 
	'impact.font',
	'plugins.observable',
	'game.scenes.level'
).defines(function() {

	TitleScene = ig.Game.extend({
		font: new ig.Font('media/brownFont.png'),
		titleBg: new ig.Image('media/titleBg.png'),

		init: function() {
			ig.input.bind(ig.KEY.X, 'next');
		},

		update: function() {
			this.parent();

			if(ig.input.pressed('next')) {
				this.fireEvent('scene-complete', 'LevelScene');
			}
		},

		draw: function() {
			this.parent();
			this.titleBg.draw(0, 0);
			this.font.draw('2013 Matt Greer           www.mattgreer.org', 30, ig.system.height - 10);
			this.font.draw('press     to begin', 86, ig.system.height - 64);
		}
	});
});


