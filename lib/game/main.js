ig.module('game.main').requires('impact.game', 'impact.font',

'game.entities.player',
'game.entities.rock',
'game.entities.crumble',
'game.entities.goal-trigger',
'game.levels.level1',

'plugins.observable'
															 
).defines(function() {

	MyGame = ig.Game.extend({
		gravity: 250,
		gold: 0,
		font: new ig.Font('media/04b03.font.png'),

		init: function() {
			ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
			ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
			ig.input.bind(ig.KEY.X, 'jump');
			ig.input.bind(ig.KEY.C, 'shoot');
			ig.input.bind(ig.KEY.P, 'pause');

			this.loadLevel(LevelLevel1);

			this.goal = this.getEntitiesByType(EntityGoalTrigger)[0];

			this.goal.on('player-made-it', this._onPlayerMadeIt.bind(this));

			this.player = this.getEntitiesByType(EntityPlayer)[0];
		},

		crumbleLevel: 59,
		rockDelay: 1,

		_onPlayerMadeIt: function() {
			this.stopCrumbling = true;
			this.madeIt = true;
		},

		update: function() {
			this.parent();

			if(ig.input.pressed('pause')) {
				this.paused = !this.paused;
			}

			if(this.paused) {
				return;
			}

			//this.screen.x = player.pos.x - ig.system.width / 2;
			this.screen.y = Math.min(this.player.pos.y - ig.system.height / 2, ig.system.height);

			if (this.player.pos.y > 8 * 40 || this.player.pos.y < - 8) {
				//window.location.href = window.location.href;
			}

			//this.doCrumble();
			this.doRock();
		},

		doRock: function() {
			// TODO: use timers
			if(this.rockDelay > 0) {
				this.rockDelay -= ig.system.tick;
				return;
			}
	
			this.spawnEntity(EntityRock, Math.random() * (ig.system.width - 16) + 8, -16);
			this.rockDelay = Math.random() * 3;
		},	

		doCrumble: function() {
			if (this.crumbleLevel < 0 || this.stopCrumbling) {
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
			if(this.madeIt) {
				this.font.draw('good job!', 50, 80);
			}

			this.font.draw('gold: ' + (this.gold || 0), 180, 5);
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

