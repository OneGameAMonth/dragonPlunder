ig.module('game.main').requires('impact.game', 'impact.font',

'game.entities.player', 'game.entities.spike', 'game.entities.crumble', 'game.levels.level1').defines(function() {

	MyGame = ig.Game.extend({
		gravity: 300,
		font: new ig.Font('media/04b03.font.png'),

		init: function() {
			ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
			ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
			ig.input.bind(ig.KEY.X, 'jump');
			ig.input.bind(ig.KEY.C, 'shoot');
			ig.input.bind(ig.KEY.P, 'pause');

			this.loadLevel(LevelLevel1);
		},

		crumbleLevel: 59,

		update: function() {
			this.parent();

			if(ig.input.pressed('pause')) {
				this.paused = !this.paused;
			}

			if(this.paused) {
				return;
			}

			var player = this.getEntitiesByType(EntityPlayer)[0];
			if (player) {
				//this.screen.x = player.pos.x - ig.system.width / 2;
				this.screen.y = Math.min(player.pos.y - ig.system.height / 2, ig.system.height);

				if (player.pos.y > 8 * 40 || player.pos.y < - 8) {
					//window.location.href = window.location.href;
				}
			}

			this.doCrumble();
		},

		doCrumble: function() {
			if (this.crumbleLevel < 0) {
				return;
			}

			var map = this.getMap('platforms').data;

			if (!map[this.crumbleLevel] || map[this.crumbleLevel].filter(function(t) {
				return t !== 0
			}).length === 0) {
				// current crumble is done, set up for next
				this.crumbleDelay = Math.random();
				--this.crumbleLevel;
			}

			if (this.crumbleDelay > 0) {
				this.crumbleDelay -= ig.system.tick;
				return;
			}

			var x;
			while (!x) {
				i = (Math.random() * map[this.crumbleLevel].length) | 0;
				x = map[this.crumbleLevel][i];
			}

			this.crumbleAt(i, this.crumbleLevel);
			this.crumbleDelay = Math.random() / 2;
		},

		draw: function() {
			this.parent();
			this.font.draw('Arrow Keys, X, C', 2, 2);

			if(this.paused) {
				this.font.draw('paused', 50, 50);
			}
		},

		crumbleAt: function(x, y) {
			this.getMap('platforms').data[y][x] = 0;
			this.collisionMap.data[y][x] = 0;
			this.spawnEntity(EntityCrumble, x * 8, y * 8);
		},

		getMap: function(name) {
			return this.backgroundMaps.filter(function(m) {
				return m.name === name
			})[0];
		}
	});

	// Start the Game with 60fps, a resolution of 240x160, scaled
	// up by a factor of 2
	ig.main('#canvas', MyGame, 60, 256, 240, 3);

});

