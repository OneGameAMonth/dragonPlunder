ig.module('game.main').requires(

'impact.game',

'plugins.observable', 

'game.scenes.title', 'game.scenes.level', 'game.scenes.game-over'

).defines(function() {
	MainGame = ig.Game.extend({
		font: new ig.Font('media/04b03.font.png'),

		init: function() {
			ig.input.bind(ig.KEY.P, 'pause');
			this._onSceneCompleteBound = this._onSceneComplete.bind(this);
			this._setScene(TitleScene);
		},

		update: function() {
			this.parent();
			if(ig.input.pressed('pause')) {
				this.paused = !this.paused;
			}

			if(!this.paused) {
				this._currentScene.update();
			}
		},

		draw: function() {
			this.parent();
			this._currentScene.draw();

			if(ig.displayFps) {
				this._updateFps(ig.system.tick);
				this.font.draw(this._fps + 'fps', ig.system.width - 27, 4);
			}
			if(this.paused) {
				ig.system.context.save();
				ig.system.context.fillStyle = 'rgba(0, 0, 0, 0.4)';
				ig.system.context.fillRect(0, 0, ig.system.realWidth, ig.system.realHeight);
				ig.system.context.restore();
				this.font.draw('paused', ig.system.width /2, ig.system.height/2, ig.Font.ALIGN.CENTER);
			}
		},

		_setScene: function(SceneClass) {
			if (this._currentScene) {
				this._currentScene.un('scene-complete', this._onSceneCompleteBound);
			}

			var scene = new SceneClass(this._persistenceManager, this._session);
			scene.on('scene-complete', this._onSceneCompleteBound);

			this._currentScene = scene;
		},

		_onSceneComplete: function(nextSceneClassName) {
			this._setScene(window[nextSceneClassName]);
		},

		_frameCount: 0,
		_elapsed: 0,
		_fps: 0,

		_updateFps: function(dt) {
			++this._frameCount;
			this._elapsed += dt;
			if (this._elapsed >= 4) {
				this._fps = (this._frameCount / this._elapsed) | 0;
				this._elapsed = 0;
				this._frameCount = 0;
			}
		}
	});

	function getUrlParam(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.href);
		if (results == null) return "";
		else return results[1];
	}

	var scale = getUrlParam('scale');
	scale = scale ? parseFloat(scale) : 3;

	ig.drawDebugInfo = !!getUrlParam('drawdebug');
	ig.displayFps = !!getUrlParam('fps');

	ig.requestedLevel = getUrlParam('level');

	ig.main('#canvas', MainGame, 60, 256, 240, scale);
});


