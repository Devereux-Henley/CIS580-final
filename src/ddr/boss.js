"use strict";

/**
  * @module Boss
  * A class representing a boss in the game
  */
module.exports = exports = MemoryBoss;

/**
  * @constructor Boss
  * Creates a Boss
  */
function MemoryBoss(position, size) {
  this.tag = "memoryBoss";
  this.LightUpLayers = []
  this.LightUpLayers[0] = "LightUpTopLeft";
  this.LightUpLayers[1] = "LightUpTopRight";
  this.LightUpLayers[2] = "LightUpBottomLeft";
  this.LightUpLayers[3] = "LightUpBottomRight";
  this.memoryCount = 2;
  this.pattern = [];
  this.gameOver = false;
}

/**
  * @function Update
  * Updates the Boss based on the supplied input
  * @param {DOMHighResTimeStamp} elapedTime
  */
Boss.prototype.update = function(elapsedTime, playerPosition, canvas) {
  while (this.pattern.count != 0 && playerPosition != onblacktile) {
    if(tilePlayerIsOn == this.pattern[0]) {
      playerPosition.x = canvas.width / 2;
      playerPosition.y = canvas.height / 2;
      this.pattern.splice(0, 1);
    }
    else {
      this.gameOver = true;
    }
  }
  if(this.pattern.count == 0){
    createNewPattern();
  }
}

Boss.prototype.createNewPattern = function(){
  this.pattern = [];
  this.memoryCount++;
  var count = 0;
  while (count < this.memoryCount) {
    this.pattern[count] = this.LightUpLayers[Math.floor(Math.random() * 3)];
  }
}

Boss.prototype.displayNewPattern = function(layers, ctx){
  var count = 0;
  var displaying = false;
  while (count < this.pattern.count) {
    layers[this.pattern[count]].render();

    if(displaying == false){
      setTimeout(function(){
        displaying = false;
        count++;
      }, 2000);
      displaying = true;
    }
  }
}
