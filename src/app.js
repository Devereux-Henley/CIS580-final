"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Boss = require('./boss-2');
const Player = require('./player');
const Spike = require('./spike');
const Trigger = require('./trigger');
const Map = require('./map');
const EntityManager = require('./entity-manager');
const SpawnManager = require('./spawnManager');
const {LevelSwitcher, Level} = require('./level_chooser/main');
const Gui = require('./gui');
var canvas = document.getElementById('screen');

const LevelCreepyCrawler = require('./level_creepy_crawler/level').Level;
const levelSwitcher = new LevelSwitcher(canvas, [
    {
        getTitle: ()=>"Level 1",
        update: (dt)=>update(dt),
        render: (dt, ctx)=>render(dt, ctx),
        hasEnded: ()=>false,
        hasWon: ()=>true,
        start: ()=>{},
    },
    new LevelCreepyCrawler({width: canvas.width, height: canvas.height}),
]);

/* Global variables */
// var game = new Game(canvas, update, render);
var game = new Game(
    canvas,
    levelSwitcher.update.bind(levelSwitcher),
    levelSwitcher.render.bind(levelSwitcher));

// Initialize player and player and player lives
var player = new Player({x: 500, y: 500});
const gui = new Gui(player);

// Initialize boss object
var boss = new Boss({x: 48, y: 48}, 4);

// Initialize Map
var background = new Image();
var map = new Map.Map(1, require('../assets/map/bossmap1.json'));
background.src = 'assets/background.png';

// Initalize entity manager
var em = new EntityManager(canvas.width, canvas.height, 32);

em.addEntity(player);
em.addEntity(boss);

var spawnManager = new SpawnManager();

var spikeNW = new Spike({x:176, y:176});
var spikeSW = new Spike({x:176, y:544});
var spikeNE = new Spike({x:784, y:176});
var spikeSE = new Spike({x:786, y:544});
var spikeSpawnerNW = {
  new: function(obj) {
    return spikeNW;
  }
};

spawnManager.addAssociation("Spike", spikeSpawnerNW);

var triggerSpawner = {
  new: function(obj) {
    return {
      render: function () {

      },
      update: function() {

      }
    };
  }
};
spawnManager.addAssociation("Trigger", triggerSpawner);
spawnManager.getLocations(map.objlayers)

var trigger = new Trigger({x:464, y:336});

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
  trigger.render(elapsedTime, ctx);
}


// HEALTH
function damagePlayer() {
	player.damage();
	gui.damage();
}
