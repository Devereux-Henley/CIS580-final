"use strict";

/* Classes and Libraries */

/* Constants */
const PLAYER_SPEED = 2;
const RENDER_TIMER = 200;

const EAST_WALK =
[new SheetPosition(0, 96),
 new SheetPosition(24, 96),
 new SheetPosition(48, 96),
 new SheetPosition(72, 96),
 new SheetPosition(96, 96),
 new SheetPosition(120, 96),
 new SheetPosition(144, 96),
 new SheetPosition(168, 96)];

 const NORTH_WALK =
 [new SheetPosition(0, 32),
	new SheetPosition(24, 32),
	new SheetPosition(48, 32),
	new SheetPosition(72, 32),
	new SheetPosition(96, 32),
	new SheetPosition(120, 32),
	new SheetPosition(144, 32),
	new SheetPosition(168, 32)];

 const WEST_WALK =
 [new SheetPosition(0, 64),
	new SheetPosition(24, 64),
	new SheetPosition(48, 64),
	new SheetPosition(72, 64),
	new SheetPosition(96, 64),
	new SheetPosition(120, 64),
	new SheetPosition(144, 64),
	new SheetPosition(168, 64)];

 const SOUTH_WALK=
 [new SheetPosition(0, 0),
	new SheetPosition(24, 0),
	new SheetPosition(48, 0),
	new SheetPosition(72, 0),
	new SheetPosition(96, 0),
	new SheetPosition(120, 0),
	new SheetPosition(144, 0),
	new SheetPosition(168, 0)];

	const EAST_DODGE=
	[new SheetPosition(0, 96),
	 new SheetPosition(0, 0),
	 new SheetPosition(0, 64),
	 new SheetPosition(0, 32)];

	const NORTH_DODGE=
	[new SheetPosition(0, 32),
	 new SheetPosition(0, 96),
	 new SheetPosition(0, 0),
	 new SheetPosition(0, 64)];

	const WEST_DODGE=
	[new SheetPosition(0, 64),
	 new SheetPosition(0, 96),
   new SheetPosition(0, 32),
   new SheetPosition(0, 0)];

	const SOUTH_DODGE=
	[new SheetPosition(0, 0),
	 new SheetPosition(0, 64),
	 new SheetPosition(0, 32),
	 new SheetPosition(0, 96)];

/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = Player;

function PlayerState(initDirection, ty) {
	this.moveState = initDirection;
	this.moveType = ty;
}

function SheetPosition(x, y) {
	this.x = x;
	this.y = y;
	this.width = 24;
	this.height = 32;
}

function MoveStyleRenders(normal, sprinting, dodging) {
	this.NORMAL = normal;
	this.SPRINTING = sprinting;
	this.DODGING = dodging;
}

/**
 * @constructor Player
 * Creates a player
 * @param {Position} starting location of the player;
 */
function Player(position) {
	this.position = position;
	this.velocity = {x: 0, y: 0};
	this.state = new PlayerState('STILL', 'NORMAL');
	this.renderSource = new Image();
	this.renderSource.src = 'assets/rpg_sprite_walk.png';
	this.timer = 0;
	this.renderPosition = 0;
	this.renderSources =
		{'STILL':
			new MoveStyleRenders(
				[new SheetPosition(0, 0)],
				[new SheetPosition(0, 0)],
			  SOUTH_DODGE
			),
		 'EAST':
			new MoveStyleRenders(
				EAST_WALK,
				EAST_WALK,
				EAST_DODGE
		 ),
		 'NORTH':
			new MoveStyleRenders(
				NORTH_WALK,
				NORTH_WALK,
				NORTH_DODGE
		 ),
		 'SOUTH':
		  new MoveStyleRenders(
			  SOUTH_WALK,
				SOUTH_WALK,
				SOUTH_DODGE
			),
		 'WEST':
			new MoveStyleRenders(
				WEST_WALK,
				WEST_WALK,
				WEST_DODGE
			),
		 'NORTHWEST':
		  new MoveStyleRenders(
			  WEST_WALK,
			  WEST_WALK,
			  WEST_DODGE
		 ),
		 'NORTHEAST':
		  new MoveStyleRenders(
			  EAST_WALK,
			  EAST_WALK,
			  EAST_DODGE
		),
		 'SOUTHWEST':
		  new MoveStyleRenders(
			  WEST_WALK,
			  WEST_WALK,
			  WEST_DODGE
		 ),
		 'SOUTHEAST':
		  new MoveStyleRenders(
			  EAST_WALK,
			  EAST_WALK,
			  EAST_DODGE
		),
	};
	// Initialize health.
	this.health = 6;
	this.hearts = [3];
	for (var i = 0; i < 3; i++) {
		this.hearts[i] = new Image();
		this.hearts[i].src = 'assets/heart_full.png';
		console.log(this.hearts[i].src);	
	}
}

Player.prototype.walk = function() {
	this.state.moveType = 'NORMAL';
}

Player.prototype.sprint = function() {
	if(this.state.moveType == 'DODGING') return;
	this.state.moveType = 'SPRINTING';
}

Player.prototype.dodge = function() {
	this.state.moveType = 'DODGING';
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

// Update Health
Player.prototype.damage = function() {
	
	if (this.hearts != null){
		if (this.health % 2 == 0){
			this.hearts[this.hearts.length - 1].src = 'assets/heart_half.png';
		}
		else {
			this.hearts.splice(this.hearts.length - 1, 1);
		}
	}
	this.health--;
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

	if(this.state.moveType == 'DODGING') {
		updateSpeed = 1.5 * PLAYER_SPEED;
	}
	else if(this.state.moveType == 'SPRINTING') {
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
 * Renders the player in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Player.prototype.render = function(elapsedTime, ctx) {
	ctx.save();
	ctx.translate(this.position.x, this.position.y);

	this.timer += elapsedTime;

//Select rendersheet based on time passed since starting this state.
	var renderstates = this.renderSources[this.state.moveState][this.state.moveType][this.renderPosition];

	if(renderstates == undefined) {
		this.renderPosition = 0;
		renderstates = this.renderSources[this.state.moveState][this.state.moveType][this.renderPosition];
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
	
	// Hearts
	for (var i = 0; i < this.hearts.length; i++ ) { 
		ctx.drawImage(
			this.hearts[i],
			0, 0, 120, 120,
		900+(40*i), 5, 40, 40
		);
	}
}
