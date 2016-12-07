"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Boss = require('./boss');
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

var boss = new Boss({x: 48, y: 48}, "", 1);
var boss2 = new Boss({x: 900, y: 48}, "", 2);

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

  // Update the Player
  checkMoveState();
  player.update(elapsedTime);

  // Update the Boss
  boss.update(elapsedTime, player.position);
  boss2.update(elapsedTime, player.position);
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  // Transform the coordinate system using
  // the camera position BEFORE rendering
  // objects in the world - that way they
  // can be rendered in WORLD cooridnates
  // but appear in SCREEN coordinates
  renderWorld(elapsedTime, ctx);
}

/**
  * @function renderWorld
  * Renders the entities in the game world
  * IN WORLD COORDINATES
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function renderWorld(elapsedTime, ctx) {
  // Background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 1024, 786);

	ctx.save();

  //TODO: Render the Boss
  player.render(elapsedTime, ctx);
  boss.render(elapsedTime, ctx);
  boss2.render(elapsedTime, ctx);
	ctx.restore();
}



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
