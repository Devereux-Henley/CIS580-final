"use strict";

/* Classes and Libraries */

/* Constants */
const PLAYER_SPEED = 10;

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

	/**
	 * @constructor Player
	 * Creates a player
	 * @param {Position} starting location of the player;
	 */
function Player(position) { 
	this.position = position;
	this.velocity = {x: 0, y: 0};
	this.state = new PlayerState('STILL', false, false);
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
		updateSpeed = 2 * PLAYER_SPEED;
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
Player.prototype.render = function(elapasedTime, ctx) { 
	ctx.save();
	ctx.translate(this.position.x, this.position.y);
	if(this.state.sprinting) {
		ctx.fillStyle = 'red';
	}
	else if(this.state.dodging) {
		ctx.fillStyle = 'yellow';
	}
	else {
		ctx.fillStyle = "pink";
	}
	ctx.fillRect(0, 0, 30, 30);
	ctx.restore();
}
