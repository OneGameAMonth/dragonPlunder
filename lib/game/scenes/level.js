ig.module('game.scenes.level').
requires('impact.game', 'impact.font',

'game.entities.player',
'game.entities.rock',
'game.entities.crumble',
'game.entities.goal-trigger',
'game.levels.sandbox',
'game.levels.level1',

'plugins.observable'
															 
).defines(function() {

	LevelScene = ig.Game.extend({
		rumble: new ig.Sound('media/sfx/rumble2.*'),

		gravity: 250,
		gold: 0,
		font: new ig.Font('media/04b03.font.png'),

		shakeLength: 1.5,
		shakeAmount: 2.5,
		lastCrumbleTime: 0,

		init: function() {
			this.shakeTimer = new ig.Timer();
			this.levelTimer = new ig.Timer();

			ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
			ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
			ig.input.bind(ig.KEY.X, 'jump');
			ig.input.bind(ig.KEY.C, 'shoot');
			ig.input.bind(ig.KEY.SHIFT, 'run');
			ig.input.bind(ig.KEY.Z, 'cape');

			this.loadLevel(ig.copy(LevelSandbox));

			this.goal = this.getEntitiesByType(EntityGoalTrigger)[0];

			this.goal.on('player-made-it', this.onPlayerMadeIt.bind(this));

			this.player = this.getEntitiesByType(EntityPlayer)[0];
			this.player.on('death', this.onPlayerDeath.bind(this));

			this.initCrumbleTimings();
			this.initRockTimings();

			this.startMusic();
		},

		startMusic: function() {
			ig.music.add( 'media/music/bg1.*' );
			ig.music.volume = 0.5;
			ig.music.play();
		},

		initRockTimings: function() {
			var platforms = this.getMap('platforms');
			var platformData = platforms.data;
			var cm = this.collisionMap.data;
			var ts = this.collisionMap.tilesize;

			var map = this.getMap('rockTimings');
			var data = map.data;

			for(var y = 0; y < data.length; ++y) {
				for(var x = 0; x < data[y].length; ++x) {
					var tile = data[y][x];

					if(tile) {
						platformData[y][x] = 0;
						cm[y][x] = 0;
						var rock = this.spawnEntity(EntityRock, x * ts, y * ts, {
							fallAfter: tile
						});
						rock.on('death', this.onRockDeath.bind(this));
					}
				}
			}
				
			platforms.preRender = true;
			delete platforms.preRenderedChunks;

			this.backgroundMaps.erase(map);
		},

		initCrumbleTimings: function() {
			this.crumbleTimings = {};

			var map = this.getMap('crumbleTimings');
			var data = map.data;

			for(var y = 0; y < data.length; ++y) {
				for(var x = 0; x < data[y].length; ++x) {
					var tile = data[y][x];

					if(tile) {
						var time = tile * 2;
						this.crumbleTimings[time] = this.crumbleTimings[time] || [];
						this.crumbleTimings[time].push({ x: x, y: y });
					}
				}
			}

			this.backgroundMaps.erase(map);
		},


		onPlayerDeath: function(player) {
			player.kill();
			this.fireEvent('scene-complete', 'GameOverScene');
		},

		onPlayerMadeIt: function() {
			this.madeIt = true;

			var me = this;
			setTimeout(function() {
				me.fireEvent('scene-complete', 'TitleScene');
			}, 2000);
		},

		update: function() {
			this.parent();

			this.screen.y = Math.min(this.player.pos.y - ig.system.height / 2, this.height - ig.system.height);

			if (this.player.pos.y > this.height) {
				this.fireEvent('scene-complete', 'GameOverScene');
			}

			this.updateCrumbles();
		},

		onRockDeath: function(rock) {
			// TODO: make this a tile location plugin
			var ts = this.collisionMap.tilesize;
			var x = Math.floor(rock.center.x / ts);
			var y = Math.round(rock.center.y / ts) + 1;

			this.crumbleAt({x: x, y: y});
		},

		updateCrumbles: function() {
			var time = this.levelTimer.delta() | 0;

			for(var i = this.lastCrumbleTime; i <= time; ++i) {
				var tiles = this.crumbleTimings[i];

				if(tiles) {
					for(var t = 0; t < tiles.length; ++t) {
						this.crumbleAt(tiles[t]);
						this.shakeTimer.set(this.shakeLength);
						this.rumble.play();
					}
				}
			}

			this.lastCrumbleTime = time;
		},

		draw: function() {
			if(this.shakeTimer.delta() < 0 && !ig.paused) {
				ig.system.context.save();
				ig.system.context.translate(Math.random() * this.shakeAmount, Math.random() * this.shakeAmount);
			}

			this.parent();

			if(this.shakeTimer.delta() < 0 && !ig.paused) {
				ig.system.context.restore();
			}

			this.font.draw('Arrow Keys, X', 2, 2);

			if(this.madeIt) {
				this.font.draw('good job!', 50, 80);
			}

			this.font.draw('gold: ' + (this.gold || 0), 180, 5);
			for(var i = 0; i < this.player.health; ++i) {
				this.font.draw('#', 140 + (i*10), 5);
			}
		},

		crumbleAt: function(pos) {
			var x = pos.x;
			var y = pos.y;
			var map = this.getMap('platforms');

			if(map.data[y][x] !== 0) {
				map.data[y][x] = 0;
				this.collisionMap.data[y][x] = 0;

				this.spawnEntity(EntityCrumble, x * 8, y * 8);

				map.preRender = true;
				delete map.preRenderedChunks;
			}
		},

		getMap: function(name) {
			return this.backgroundMaps.filter(function(m) {
				return m.name === name
			})[0];
		}
	});

	Object.defineProperty(LevelScene.prototype, 'height', {
		get: function() {
			var map = this.getMap('platforms');
			return (map && (map.height * this.collisionMap.tilesize)) || 0;
		}
	});
});

