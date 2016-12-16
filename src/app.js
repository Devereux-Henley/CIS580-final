
"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Boss = require('./boss-2');
const Player = require('./player');
const Map = require('./map');
const EntityManager = require('./entity-manager');
const SpawnManager = require('./spawnManager');
const {LevelSwitcher, Level} = require('./level_chooser/main');
const Gui = require('./gui');

const MissleLevel = require('./missle_boss.js');
const ElBlobboLevel = require('./elblobbo.js')
var canvas = document.getElementById('screen');

const MemoryBoss = require('./ddr/boss');

// Initialize player and player and player lives
var player = new Player({x: 500, y: 500});
const gui = new Gui(player);

const levelSwitcher = new LevelSwitcher(canvas, [
    new MissleLevel(),
    new LevelTown({width: canvas.width, height: canvas.height}),
    new ElBlobboLevel(),
    new MemoryBoss(player, {width: canvas.width, height: canvas.height})
]);


/* Global variables */
// var game = new Game(canvas, update, render);
var game = new Game(
    canvas,
    levelSwitcher.update.bind(levelSwitcher),
    levelSwitcher.render.bind(levelSwitcher));



// Initialize boss object
var boss = new Boss({x: 48, y: 48}, 4);

// Initialize Map
var background = new Image();
var map = new Map.Map(2, require('../assets/map/bossmap1.json'));
background.src = 'assets/background.png';

// Initalize entity manager
var em = new EntityManager(canvas.width, canvas.height, 32);

em.addEntity(player);
em.addEntity(boss);

var spawnManager = new SpawnManager();
var spikeSpawner = {
  new: function(obj) {

    return {
      render: function (elapsedTime, ctx) {
        ctx.beginPath();
        let innerRadius = 50;
        let outerRadius = 200;
        let lineWidth = outerRadius - innerRadius;
        ctx.arc(200, 200, innerRadius + lineWidth/2, 0, Math.PI);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillText("there is some text stuff here", 300, 300);
      },
      update: function() {

      }
    };
  }
};
spawnManager.addAssociation("Spike", spikeSpawner);

var tileSpawner = {
  new: function(obj) {
    return {
      render: function () {

      },
      update: function() {

      }
    };
  }
};
spawnManager.addAssociation("Tile", tileSpawner);
spawnManager.getLocations(map.objlayers)

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
  player.update(elapsedTime);
  boss.update(elapsedTime, player.position);
  gui.update(elapsedTime);
  MemoryBoss.update(elapsedTime, player.position, canvas);

  em.updateEntity(player);
  em.updateEntity(boss);

  em.collide();
  spawnManager.update(elapsedTime);
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

  // Render Boss
  boss.render(elapsedTime, ctx);
  gui.render(elapsedTime, ctx);
  spawnManager.render(elapsedTime, ctx);
}


  // spawnManager.render(ctx, elapsedTime);
  // gui.render(elapsedTime, ctx);
