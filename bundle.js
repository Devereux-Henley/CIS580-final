(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Player = require('./player');


/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var input = {
  up: false,
  down: false,
  left: false,
  right: false,
  shift: false,
  dodge: false
}


var player = new Player({x: 500, y: 500});
var hearts = [3];
for (var i = 0; i < 3; i++) {
		hearts[i] = new Image();
		hearts[i].src = 'assets/heart_full.png';
		console.log(hearts[i].src);
}
var background = new Image();
background.src = 'assets/background.png';

/**
 * @function onkeydown
 * Handles keydown events
 */
window.onkeydown = function(event) {
  input.shift = event.shiftKey;
  switch(event.key) {
	  case "W":
    case "ArrowUp":
    case "w":
      input.up = true;
      event.preventDefault();
      break;
	  case "S":
    case "ArrowDown":
    case "s":
      input.down = true;
      event.preventDefault();
      break;
	  case "A":
    case "ArrowLeft":
    case "a":
      input.left = true;
      event.preventDefault();
      break;
	  case "D":
    case "ArrowRight":
    case "d":
      input.right = true;
	  event.preventDefault();
      break;	
	case " ":
	  input.space = true;
	  event.preventDefault();
	  break; 
	// Decrement health - test
	case "T":
	case "t":
	  damagePlayer();
	  break;
  }
}

/**
 * @function onkeyup
 * Handles keydown events
 */
window.onkeyup = function(event) {
  input.shift = event.shiftKey;
  switch(event.key) {
	  case "W":
    case "ArrowUp":
    case "w":
      input.up = false;
      event.preventDefault();
      break;
	  case "S":
    case "ArrowDown":
    case "s":
      input.down = false;
      event.preventDefault();
      break;
	  case "A":
    case "ArrowLeft":
    case "a":
      input.left = false;
      event.preventDefault();
      break;
	  case "D":
    case "ArrowRight":
    case "d":
      input.right = false;
      event.preventDefault();
      break;
	  case " ":
	    input.space = false;
	    event.preventDefault();
	    break;
  }
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  // update the player
  checkMoveState();
  player.update(elapsedTime);
}

function checkMoveState() {

	player.walk();

	if(input.shift) {
		player.sprint();
	}
	else if(input.space) {
		player.dodge();
	}

	if(input.up) {
		if(input.right) {
			player.moveNorthEast();
		}
		else if (input.left) {
			player.moveNorthWest();
		}
		else if (input.down) {
			player.still();
		}
		else {
			player.moveNorth();
		}
		return;
	}
	else if(input.right) {
		if(input.left) {
			player.still();
		}
		else if (input.down) {
			player.moveSouthEast();
		}
		else {
			player.moveEast();
		}
		return;
	}
	else if(input.down) {
		if(input.left) {
			player.moveSouthWest();
		}
		else {
			player.moveSouth();
		}
		return;
	}
	else if(input.left) {
		player.moveWest();
		return;
	}
	else {
		player.still();
		return;
	}
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 1024, 786);

  // TODO: Render background

  // Transform the coordinate system using
  // the camera position BEFORE rendering
  // objects in the world - that way they
  // can be rendered in WORLD cooridnates
  // but appear in SCREEN coordinates
  renderWorld(elapsedTime, ctx);

  // Render the GUI without transforming the
  // coordinate system
  renderGUI(elapsedTime, ctx);
}

/**
  * @function renderWorld
  * Renders the entities in the game world
  * IN WORLD COORDINATES
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function renderWorld(elapsedTime, ctx) {
    // Render the player
	ctx.drawImage(
		background,
		0, 0, 640, 400,
		0, 0, canvas.width, canvas.height);

	ctx.save();
  player.render(elapsedTime, ctx);
	ctx.restore();
	
	for (var i = 0; i < hearts.length; i++ ) {
		ctx.drawImage(
			hearts[i],
			0, 0, 120, 120,
		900+(40*i), 5, 40, 40
		);
	}
}

// HEALTH
function damagePlayer() {
	if (hearts != null){
		if (player.getHealth() % 2 == 0){
			hearts[hearts.length - 1].src = 'assets/heart_half.png';
		}
		else {
			hearts.splice(hearts.length - 1, 1);
		}
	}
	player.damage();
}

/**
  * @function renderGUI
  * Renders the game's GUI IN SCREEN COORDINATES
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx
  */
function renderGUI(elapsedTime, ctx) {
  // TODO: Render the GUI

}

},{"./game":2,"./player":3}],2:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],3:[function(require,module,exports){
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
  this.tag = "player";
  this.shape = "square";
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
  this.currentRender = this.renderSources[this.state.moveState][this.state.moveType][this.renderPosition];
  this.health = 6;
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
	this.health--;
}

Player.prototype.onCollision = function(entity) {

}

Player.prototype.getHealth = function() {
	return this.health;
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

  this.timer += elapsedTime;

  if(this.timer > RENDER_TIMER) {
    this.renderPosition++;
    this.timer = 0;
  }

  var nextRender = this.renderSources[this.state.moveState][this.state.moveType][this.renderPosition];

  if(nextRender == undefined) {
    this.renderPosition = 0;
    nextRender = this.renderSources[this.state.moveState][this.state.moveType][this.renderPosition];
  }
  else {
    this.currentRender = nextRender;
  }
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

//Select rendersheet based on time passed since starting this state.
	ctx.drawImage(
		this.renderSource,
		this.currentRender.x, this.currentRender.y, this.currentRender.width, this.currentRender.height,
		0, 0, 24, 32);
	ctx.restore();
}

},{}]},{},[1]);
