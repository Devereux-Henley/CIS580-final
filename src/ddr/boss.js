"use strict";

/**
  * @module Boss
  * A class representing a boss in the game
  */
module.exports = exports = MemoryBoss;
const map = require('../../assets/map/ddr.json');
const Map = require('../map.js');

var mainMap = new Map.Map(1, map);

/**
  * @constructor Boss
  * Creates a Boss
  */
function MemoryBoss(player, canvas) {
  this.tag = "memoryBoss";
  this.cornerTileIds = [];
  this.cornerTileIds[0] = 15;
  this.cornerTileIds[1] = 893;
  this.cornerTileIds[2] = 6;
  this.cornerTileIds[3] = 31;
  this.LightUpLayers = [];
  this.LightUpLayers[15] = "LightUpTopLeft";
  this.LightUpLayers[893] = "LightUpTopRight";
  this.LightUpLayers[6] = "LightUpBottomLeft";
  this.LightUpLayers[31] = "LightUpBottomRight";
  this.memoryCount = 2;
  this.pattern = [];
  this.gameOver = false;
  this.player = player;
  this.canvas = canvas;
  this.count = 0;
  this.displaying = false;
  this.displayedNewPattern = false;
  this.timer = 0;
}

MemoryBoss.prototype.start = function(){
  //this.render();
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
    var tileID = mainMap.getLayerByName("MainLayer").getTile(Math.floor(this.player.position.x / 16), Math.floor(this.player.position.y / 16)).id;
    if(tileID != 715 && tileID == this.pattern[0]) {
      this.player.position.x = this.canvas.width / 2;
      this.player.position.y = this.canvas.height / 2;
      this.pattern.splice(0, 1);
    }
    else if(tileID != this.pattern[0] && tileID != 715){
      this.gameOver = true;
    }
  }
  if(this.pattern.length == 0){
    this.createNewPattern();
  }
}

MemoryBoss.prototype.createNewPattern = function(){
  this.pattern = [];
  this.memoryCount++;
  var count = 0;
  while (count < this.memoryCount) {
    this.pattern[count] = this.cornerTileIds[Math.floor(Math.random() * 3)];
    console.log(this.pattern);
    count++;
  }
  this.displayedNewPattern = false;
}

MemoryBoss.prototype.hasEnded = function(){
  if(this.gameOver == true){
    return true;
  }
  return false;
}

MemoryBoss.prototype.hasWon = function(){
  return false;
}

MemoryBoss.prototype.displayNewPattern = function(ctx){
  this.count = 0;
  this.timer = 0;
  while (this.count < this.pattern.length) {
    mainMap.getLayerByName(this.LightUpLayers[this.pattern[this.count]]).render(ctx);

    if(this.timer > 2000){
      this.count++;
      this.timer = 0;
    }
  }
}

MemoryBoss.prototype.render = function(elapsedTime, ctx){
  mainMap.getLayerByName("MainLayer").render(ctx);
  this.player.render(elapsedTime, ctx);
  if(this.displayedNewPattern == false){
    this.displayNewPattern(ctx);
    this.displayedNewPattern = true;
  }
}
