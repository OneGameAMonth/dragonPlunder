ig.module('game.entities.player').requires('impact.entity', 'plugins.center').defines(function() {

	EntityPlayer = ig.Entity.extend({
		size: {
			x: 4,
			y: 14
		},
		offset: {
			x: 6,
			y: 10
		},
		isPlayer: true,

		maxVel: {
			x: 100,
			y: 200
		},
		friction: {
			x: 200,
			y: 0
		},
		zIndex: 2000,
		health: 3,
		hitStunDuration: 2,

		type: ig.Entity.TYPE.A,
		checkAgainst: ig.Entity.TYPE.NONE,
		//collides: ig.Entity.COLLIDES.PASSIVE,

		animSheet: new ig.AnimationSheet('media/player.png', 16, 24),

		flip: false,
		accelGround: 400,
		accelAir: 200,
		jump: 200,
		flip: false,
		jumpCount: 0,

		init: function(x, y, settings) {
			Object.defineProperty(this, 'collides', {
				get: function() {
					if(this.vel.y < 0) {
						return ig.Entity.COLLIDES.NONE;
					}
					return ig.Entity.COLLIDES.PASSIVE;
				}
			});
			this.parent(x, y, settings);

			this.addAnim('idle', 1, [0]);
			this.addAnim('walk', 0.07, [0, 1, 2]);
			this.addAnim('jump', 1, [9]);
			this.addAnim('fall', 1, [6]);
			this.addAnim('cape', 0.2, [10,11]);
			this.addAnim('hitStun', 1, [7]);
			this.addAnim('cling', 1, [8]);

			this.hitStunTimer = new ig.Timer();
		},

		update: function() {
			var accel = this.standing ? this.accelGround: this.accelAir;

			if(this.hitStunTimer.delta() >= 0) {
				if(ig.input.state('run') && !this.wallClinging) {
					accel *= 1.5;
					this.maxVel.x = 200;
					this.maxVel.y = 400;
				} else {
					this.maxVel.x = 100;
					this.maxVel.y = 200;
				}

				// only allow input if not in hit stun
				if (ig.input.state('left')) {
					this.accel.x = - accel;
					this.flip = true;
				}
				else if (ig.input.state('right')) {
					this.accel.x = accel;
					this.flip = false;
				}
				else {
					this.accel.x = 0;
				}

				if(ig.input.pressed('jump')) {
					if(this.jumpCount < 2) {
						this.vel.y = -this.jump;
						this.jumpCount++;
						if(ig.input.state('run') && this.jumpCount === 1) {
							this.vel.y *= 1.5;
						}
					}
					if(this.wallClinging && !this.standing) {
						this.vel.y = -this.jump;
						this.vel.x = 200 * this.wallClingNormal;
					}
				}

				if (this.vel.y < 0) {
					this.currentAnim = this.anims.jump;
				}
				else if (this.vel.y > 0) {
					this.currentAnim = this.anims.fall;
				}
				else if (this.vel.x != 0) {
					this.currentAnim = this.anims.walk;
				}
				else {
				this.currentAnim = this.anims.idle;
				}

				if(this.wallClinging && !this.standing) {
					this.currentAnim = this.anims.cling;
				}

				this.currentAnim.flip.x = this.flip;
			} else {
				this.currentAnim = this.anims.hitStun;
				this.currentAnim.flip.x = this.flip;
			}

			if(ig.input.state('cape') && this.vel.y > 50) {
				this.vel.y = 50;
				this.currentAnim = this.anims.cape;
				this.currentAnim.flip.x = this.flip;
			}

			this.parent();
			this.boundToLevel();

			if(this.standing) {
				this.jumpCount = 0;
			}
		},

		boundToLevel: function() {
			if(this.pos.x < 0) {
				this.pos.x = 0;
			}
			if(this.pos.x > ig.system.width - this.size.x) {
				this.pos.x = ig.system.width - this.size.x;
			}
		},

		handleMovementTrace: function(res) {
			this.friction.y = 0;

			this.wallClinging = res.collision.slope.nx;
			this.wallClingNormal = res.collision.slope.nx;

			if(this.wallClinging) {
				this.friction.y = 400;
			}

			this.parent(res);
		},

		receiveDamage: function(damage, from) {
			this.health -= damage;
			if(this.health <= 0) {
				this.fireEvent('death', this);
			} else {
				this.hitStunTimer.set(this.hitStunDuration);
			}
		}
	});

	EntityPlayer.inject(MixinCenter);
});

