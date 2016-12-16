"use strict";

/**
  * @module Boss
  * A class representing a boss in the game
  */
module.exports = exports = MemoryBoss;
const map = require('../../assets/map/ddr.json');
const Map = require('../map.js');
const Player = require('../player');

var mainMap = new Map.Map(1, map);

/**
  * @constructor Boss
  * Creates a Boss
  */
function MemoryBoss(canvas) {
  this.player = new Player({x: 500, y: 500});
  this.tag = "memoryBoss";
  this.cornerTileIds = [];
  this.cornerTileIds[1] = 893;
  this.cornerTileIds[2] = 15;
  this.cornerTileIds[3] = 6;
  this.cornerTileIds[4] = 31;
  this.LightUpLayers = [];
  this.LightUpLayers[893] = "LightUpTopLeft";
  this.LightUpLayers[15] = "LightUpTopRight";
  this.LightUpLayers[6] = "LightUpBottomLeft";
  this.LightUpLayers[31] = "LightUpBottomRight";
  this.memoryCount = 2;
  this.memoryDisplayCount = 0;
  this.pattern = [];
  this.gameOver = false;
  this.canvas = canvas;
  this.count = 0;
  this.displaying = false;
  this.displayedNewPattern = false;
  this.timer = 0;
  this.displayPatternSound = new Audio();
  this.displayPatternSound.src = './assets/displayPattern.wav'
  this.correctSound = new Audio();
  this.correctSound.src = './assets/correctPattern.wav'
  this.incorrectSound = new Audio();
  this.incorrectSound.src = './assets/incorrectPattern.wav'
  this.soundCounter = 0;
}

MemoryBoss.prototype.start = function(){
    this.player = new Player({x: 500, y: 500});
  this.tag = "memoryBoss";
  this.cornerTileIds = [];
  this.cornerTileIds[1] = 893;
  this.cornerTileIds[2] = 15;
  this.cornerTileIds[3] = 6;
  this.cornerTileIds[4] = 31;
  this.LightUpLayers = [];
  this.LightUpLayers[893] = "LightUpTopLeft";
  this.LightUpLayers[15] = "LightUpTopRight";
  this.LightUpLayers[6] = "LightUpBottomLeft";
  this.LightUpLayers[31] = "LightUpBottomRight";
  this.memoryCount = 2;
  this.memoryDisplayCount = 0;
  this.pattern = [];
  this.gameOver = false;
  this.count = 0;
  this.displaying = false;
  this.displayedNewPattern = false;
  this.timer = 0;
  this.soundCounter = 0;
}

MemoryBoss.prototype.getTitle = function(){
  return "Memory Boss";
}

/**
  * @function Update
  * Updates the Boss based on the supplied input
  * @param {DOMHighResTimeStamp} elapedTime
  */
MemoryBoss.prototype.update = function(elapsedTime) {
  this.timer += elapsedTime;
  this.player.update(elapsedTime);
  if (this.pattern.length != 0) {
    var tileID = mainMap.getLayerByName("MainLayer").getTile(Math.floor((this.player.position.x + this.player.currentRender.width / 2) / 16), Math.floor((this.player.position.y + this.player.currentRender.height / 2) / 16)).id - 1;
    if(tileID != 714 && tileID == this.pattern[0]) {
      this.correctSound.play();
      this.player.position.x = this.canvas.width / 2;
      this.player.position.y = this.canvas.height / 2;
      this.pattern.splice(0, 1);
    }
    else if(tileID != this.pattern[0] && tileID != 714){
      console.log(tileID, this.pattern[0]);
      this.incorrectSound.play();
      this.gameOver = true;
    }
  }
  if(this.pattern.length == 0){
    this.displayedNewPattern = false;
  }
}

MemoryBoss.prototype.createNewPattern = function(){
  this.memoryCount++;
  this.memoryDisplayCount = 0;
  this.count = 0;
  while (this.count < this.memoryCount) {
    this.pattern[this.count] = this.cornerTileIds[Math.floor(Math.random() * 4) + 1];
    console.log(this.pattern);
    this.count++;
  }
}

MemoryBoss.prototype.hasEnded = function(){
  if(this.gameOver == true){
    return true;
  }
  return false;
}

MemoryBoss.prototype.hasWon = function(){
  if(this.memoryCount > 7){
    return true;
  }
  return false;
}

MemoryBoss.prototype.displayNewPattern = function(ctx){
  if(this.pattern.length == 0){
    this.createNewPattern();
    this.timer = 0;
  }
  if(this.memoryDisplayCount < this.pattern.length && this.timer > 500) {
    if(this.soundCounter == 0){
      this.displayPatternSound.play();
      this.soundCounter++;
    }
    mainMap.getLayerByName(this.LightUpLayers[this.pattern[this.memoryDisplayCount]]).render(ctx);
    if(this.timer >= 1500){
      this.memoryDisplayCount++;
      this.timer = 0;
      this.soundCounter = 0;
    }
  }
}

MemoryBoss.prototype.render = function(elapsedTime, ctx){
  mainMap.getLayerByName("MainLayer").render(ctx);
  this.player.render(elapsedTime, ctx);
  this.displayNewPattern(ctx);
}
