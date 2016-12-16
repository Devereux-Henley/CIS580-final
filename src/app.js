"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Boss = require('./boss-2');
const Player = require('./player');
const Map = require('./map');
const EntityManager = require('./entity-manager');
const SpawnManager = require('./spawnManager');
const {LevelSwitcher, Level} = require('./level_chooser/main');
//const Gui = require('./gui');

var canvas = document.getElementById('screen');

const LevelCreepyCrawler = require('./level_creepy_crawler/level').Level;
<<<<<<< HEAD
const LevelTown = require('./level_town/level_town').Level;
const ElBlobbo = require('./el_blobbo').Level;

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
    new LevelTown({width: canvas.width, height: canvas.height}),
    new ElBlobbo({width: canvas.width, height: canvas.height})
]);

/* Global variables */
//var game = new Game(canvas, update, render);
var game = new Game(
    canvas,
    levelSwitcher.update.bind(levelSwitcher),
    levelSwitcher.render.bind(levelSwitcher));

// Initialize player and player and player lives
//var type = "hero";
var player = new Player({x: 500, y: 500});
//var gui = new Gui(player);

// Initialize boss object
var boss = new Boss({x: 48, y: 48}, 4);

// Initialize Map
var background = new Image();
//var map = new Map.Map(2, require('../assets/map/bossmap1.json'));
background.src = 'assets/background.png';

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

  //gui.update(elapsedTime);
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

  //map.getLayers().forEach(function(layer) {
  //  layer.render(ctx);
  //});

  // Render the player
  ctx.save();
  player.render(elapsedTime, ctx);
  ctx.restore();

  // Render Boss
  boss.render(elapsedTime, ctx);

  // spawnManager.render(ctx, elapsedTime);
  // gui.render(elapsedTime, ctx);
}
