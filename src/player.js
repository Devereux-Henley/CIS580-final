"use strict";

/* Classes and Libraries */

/* Constants */
const PLAYER_SPEED = 2;
const RENDER_TIMER = 200;
	/**
	 * @module Player
	 * A class representing a player's helicopter
	 */
module.exports = exports = Player;

function PlayerState(initDirection, sprinting, dodging) {
	this.moveState = initDirection;
	this.sprinting = sprinting;
	this.dodging = dodging;
}

function SheetPosition(x, y) {
	this.x = x;
	this.y = y;
	this.width = 24;
	this.height = 32;
}

	/**
	 * @constructor Player
	 * Creates a player
	 * @param {Position} starting location of the player;
	 */
function Player(position) { 
	this.position = position;
	this.velocity = {x: 0, y: 0};
	this.state = new PlayerState('STILL', false, false);
	this.renderSource = new Image();
	this.renderSource.src = 'assets/rpg_sprite_walk.png';
	this.timer = 0;
	this.renderPosition = 0;
	this.renderSources = 
		{'STILL':     [new SheetPosition(0, 0)],
		 'EAST':      [new SheetPosition(0, 96),
		               new SheetPosition(24, 96),
		               new SheetPosition(48, 96),
		               new SheetPosition(72, 96),
		               new SheetPosition(96, 96),
		               new SheetPosition(120, 96),
		               new SheetPosition(144, 96),
		               new SheetPosition(168, 96)],
		 'NORTH':     [new SheetPosition(0, 32),
		               new SheetPosition(24, 32),
		               new SheetPosition(48, 32),
		               new SheetPosition(72, 32),
		               new SheetPosition(96, 32),
		               new SheetPosition(120, 32),
		               new SheetPosition(144, 32),
		               new SheetPosition(168, 32)],
		 'SOUTH':     [new SheetPosition(0, 0),
		               new SheetPosition(24, 0),
		               new SheetPosition(48, 0),
		               new SheetPosition(72, 0),
		               new SheetPosition(96, 0),
		               new SheetPosition(120, 0),
		               new SheetPosition(144, 0),
		               new SheetPosition(168, 0)],
		 'WEST':      [new SheetPosition(0, 64),
		               new SheetPosition(24, 64),
		               new SheetPosition(48, 64),
		               new SheetPosition(72, 64),
		               new SheetPosition(96, 64),
		               new SheetPosition(120, 64),
		               new SheetPosition(144, 64),
		               new SheetPosition(168, 64)],
		 'NORTHWEST': [new SheetPosition(0, 64),
		               new SheetPosition(24, 64),
		               new SheetPosition(48, 64),
		               new SheetPosition(72, 64),
		               new SheetPosition(96, 64),
		               new SheetPosition(120, 64),
		               new SheetPosition(144, 64),
		               new SheetPosition(168, 64)],
		 'NORTHEAST': [new SheetPosition(0, 96),
		               new SheetPosition(24, 96),
		               new SheetPosition(48, 96),
		               new SheetPosition(72, 96),
		               new SheetPosition(96, 96),
		               new SheetPosition(120, 96),
		               new SheetPosition(144, 96),
		               new SheetPosition(168, 96)],
		 'SOUTHWEST': [new SheetPosition(0, 64),
		               new SheetPosition(24, 64),
		               new SheetPosition(48, 64),
		               new SheetPosition(72, 64),
		               new SheetPosition(96, 64),
		               new SheetPosition(120, 64),
		               new SheetPosition(144, 64),
		               new SheetPosition(168, 64)],
		 'SOUTHEAST': [new SheetPosition(0, 96),
		               new SheetPosition(24, 96),
		               new SheetPosition(48, 96),
		               new SheetPosition(72, 96),
		               new SheetPosition(96, 96),
		               new SheetPosition(120, 96),
		               new SheetPosition(144, 96),
		               new SheetPosition(168, 96)],
};
}

Player.prototype.moveWest = function() {
	this.state.moveState = 'WEST';
}

Player.prototype.moveEast = function() {
	this.state.moveState = 'EAST';
}

Player.prototype.moveNorth = function() {
	this.state.moveState = 'NORTH';
}

Player.prototype.moveSouth = function() {
	this.state.moveState = 'SOUTH';
}

Player.prototype.moveNorthEast = function() {
	this.state.moveState = 'NORTHEAST';
}

Player.prototype.moveNorthWest = function() {
	this.state.moveState = 'NORTHWEST';
}

Player.prototype.moveSouthEast = function() {
	this.state.moveState = 'SOUTHEAST';
}

Player.prototype.moveSouthWest = function() {
	this.state.moveState = 'SOUTHWEST';
}

Player.prototype.still = function() {
	this.state.moveState = 'STILL';
}
	/**
	 * @function update
	 * Updates the player based on the supplied input
	 * @param {DOMHighResTimeStamp} elapsedTime
	 * @param {Input} input object defining input, must have
	 * boolean properties: up, left, right, down
	 */
Player.prototype.update = function(elapsedTime) {

	// set the velocity
	this.velocity.x = 0;
	this.velocity.y = 0;

	var updateSpeed = PLAYER_SPEED;
	if(this.state.sprinting) {
		updateSpeed = 1.5 * PLAYER_SPEED;
	}

	switch(this.state.moveState) {
		case 'NORTH':
			this.velocity.y -= updateSpeed;
			break;
		case 'EAST':
			this.velocity.x += updateSpeed;
			break;
		case 'SOUTH':
			this.velocity.y += updateSpeed;
			break;
		case 'WEST':
			this.velocity.x -= updateSpeed;
			break;
		case 'NORTHEAST':
			this.velocity.x += updateSpeed;
			this.velocity.y -= updateSpeed;
			break;
		case 'NORTHWEST':
			this.velocity.x -= updateSpeed;
			this.velocity.y -= updateSpeed;
			break;
		case 'SOUTHEAST':
			this.velocity.x += updateSpeed;
			this.velocity.y += updateSpeed;
			break;
		case 'SOUTHWEST':
			this.velocity.x -= updateSpeed;
			this.velocity.y += updateSpeed;
			break;
	}

	// move the player
	this.position.x += this.velocity.x;
	this.position.y += this.velocity.y;
}

	/**
	 * @function render
	 * Renders the player helicopter in world coordinates
	 * @param {DOMHighResTimeStamp} elapsedTime
	 * @param {CanvasRenderingContext2D} ctx
	 */
Player.prototype.render = function(elapsedTime, ctx) { 
	ctx.save();
	ctx.translate(this.position.x, this.position.y);

	this.timer += elapsedTime;

	var renderstates = this.renderSources[this.state.moveState][this.renderPosition];
	if(renderstates == undefined) {
		this.renderPosition = 0;
		renderstates = this.renderSources[this.state.moveState][this.renderPosition];
	}
	
	if(this.timer > RENDER_TIMER) {
		this.renderPosition++;
		this.timer = 0;
	}	

	ctx.drawImage(
		this.renderSource,
		renderstates.x, renderstates.y, renderstates.width, renderstates.height,
		0, 0, 24, 32);
	ctx.restore();
}
