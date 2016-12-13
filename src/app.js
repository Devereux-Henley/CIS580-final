"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Boss = require('./boss-2');
const Player = require('./player');
const Map = require('./map');
const EntityManager = require('./entity-manager');
const {LevelSwitcher, Level} = require('./level_chooser/main');
var canvas = document.getElementById('screen');

const LevelCreepyCrawler = require('./level_creepy_crawler/level').Level;
const levelSwitcher = new LevelSwitcher(canvas, [
    {
        getTitle: ()=>"Level 1",
        update: (dt)=>update(dt),
        render: (dt, ctx)=>render(dt, ctx),
        hasEnded: ()=>false,
        start: ()=>{},
    },
    new LevelCreepyCrawler(),
]);

/* Global variables */
// var game = new Game(canvas, update, render);
var game = new Game(
    canvas,
    levelSwitcher.update.bind(levelSwitcher),
    levelSwitcher.render.bind(levelSwitcher));

var input = {
  up: false,
  down: false,
  left: false,
  right: false,
  shift: false,
  dodge: false
}

// Initialize player and player and player lives
var player = new Player({x: 500, y: 500});
var hearts = [3];
for (var i = 0; i < 3; i++) {
		hearts[i] = new Image();
		hearts[i].src = 'assets/heart_full.png';
}

// Initialize boss object
var boss = new Boss({x: 48, y: 48}, 1);

// Initialize Map
var background = new Image();
var map = new Map.Map(2);
background.src = 'assets/background.png';

// Initalize entity manager
var em = new EntityManager(canvas.width, canvas.height, 32);

em.addEntity(player);
em.addEntity(boss);

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
  boss.update(elapsedTime, player.position);

  em.updateEntity(player);
  em.updateEntity(boss);

  em.collide();

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
	ctx.drawImage(
		background,
		0, 0, 640, 400,
		0, 0, canvas.width, canvas.height);

  map.getLayers().forEach(function(layer) {
    layer.render(ctx);
  });

  // Render the player
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

  // Render Boss
  boss.render(elapsedTime, ctx);

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

/**
 * Checks the current state of movement of player
 */
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
