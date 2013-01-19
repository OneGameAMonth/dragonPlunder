ig.module('game.scenes.level').
requires('impact.game', 'impact.font',

'game.entities.player',
'game.entities.rock',
'game.entities.crumble',
'game.entities.goal-trigger',
'game.levels.level1',

'plugins.observable'
															 
).defines(function() {

	LevelScene = ig.Game.extend({
		rumble0: new ig.Sound('media/sfx/rumble0.*'),
		rumble1: new ig.Sound('media/sfx/rumble1.*'),
		rumble2: new ig.Sound('media/sfx/rumble2.*'),

		gravity: 250,
		gold: 0,
		font: new ig.Font('media/04b03.font.png'),

		init: function() {
			ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
			ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
			ig.input.bind(ig.KEY.X, 'jump');
			ig.input.bind(ig.KEY.C, 'shoot');

			this.loadLevel(LevelLevel1);

			this.goal = this.getEntitiesByType(EntityGoalTrigger)[0];

			this.goal.on('player-made-it', this._onPlayerMadeIt.bind(this));

			this.player = this.getEntitiesByType(EntityPlayer)[0];

			this.shakeDuration = this.shakeLength;

			this.rumbles = [
				this.rumble0, this.rumble1, this.rumble2
			];
		},

		crumbleLevel: 59,
		rockDelay: 1,
		nonShakeDuration: 3,
		shakeLength: 1.5,

		_onPlayerMadeIt: function() {
			this.stopCrumbling = true;
			this.madeIt = true;

			var me = this;
			setTimeout(function() {
				me.fireEvent('scene-complete', 'TitleScene');
			}, 2000);
		},

		update: function() {
			this.parent();

			//this.screen.x = player.pos.x - ig.system.width / 2;
			this.screen.y = Math.min(this.player.pos.y - ig.system.height / 2, ig.system.height);

			if (this.player.pos.y > 8 * 40 || this.player.pos.y < - 8) {
				//window.location.href = window.location.href;
			}

			if(this.hasRumbled) {
				this.doCrumble();
			}
			this.doRock();
			this.updateShake();
		},

		updateShake: function() {
			if(this.nonShakeDuration > 0) {
				this.nonShakeDuration -= ig.system.tick;

				if(this.nonShakeDuration > 0) {
					return;
				} else {
					this.rumble2.volume = Math.random() * 0.5 + 0.5;
					this.rumble2.play();
					this.hasRumbled = true;
				}
			}

			if(this.nonShakeDuration < 0) {
				if(this.shakeDuration > 0) {
					this.shakeDuration -= ig.system.tick;
				}
				if(this.shakeDuration < 0) {
					this.nonShakeDuration = (3 * Math.random()) + 2;
					this.shakeDuration = this.shakeLength;
				}
			}

		},

		doRock: function() {
			// TODO: use timers
			if(this.rockDelay > 0) {
				this.rockDelay -= ig.system.tick;
				return;
			}
	
			var rock = this.spawnEntity(EntityRock, Math.random() * (ig.system.width - 16) + 8, -16);
			rock.on('death', this._onRockDeath.bind(this));
			this.rockDelay = (Math.random() * 3) + 4;
		},	

		_onRockDeath: function(rock) {
			var ts = this.collisionMap.tilesize;
			var x = Math.floor(rock.center.x / ts);
			var y = Math.round(rock.center.y / ts) + 1;

			this.crumbleAt(x, y);
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

			var count = 4;// (Math.random() * 3) | 0;
			var i = 0;

			for(var c = 0; c < count; ++c) {
				var x;
				while (!x && map[this.crumbleLevel].filter(function(cell) { return cell !== 0}).length >= count - c) {
					i = (Math.random() * map[this.crumbleLevel].length) | 0;
					x = map[this.crumbleLevel][i];
				}

				this.crumbleAt(i, this.crumbleLevel);
				x = 0;
			}
			this.crumbleDelay = Math.random() / 10;
		},

		draw: function() {
			if(this.nonShakeDuration < 0) {
				ig.system.context.save();
				ig.system.context.translate(Math.random() * 5, Math.random() * 5);
			}

			this.parent();

			if(this.nonShakeDuration < 0) {
				ig.system.context.restore();
			}

			this.font.draw('Arrow Keys, X, C', 2, 2);

			if(this.madeIt) {
				this.font.draw('good job!', 50, 80);
			}

			this.font.draw('gold: ' + (this.gold || 0), 180, 5);
		},

		crumbleAt: function(x, y) {
			if(this.getMap('platforms').data[y][x] !== 0) {
				this.getMap('platforms').data[y][x] = 0;
				this.collisionMap.data[y][x] = 0;
				this.spawnEntity(EntityCrumble, x * 8, y * 8);
			}
		},

		getMap: function(name) {
			return this.backgroundMaps.filter(function(m) {
				return m.name === name
			})[0];
		}
	});
});

