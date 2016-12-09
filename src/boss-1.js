"use strict";

/**
  * @module Boss
  * A class representing a boss in the game
  */
module.exports = exports = Boss;

/**
  * @constructor Boss
  * Creates a Boss
  */
function Boss(spd) {
  this.state = "idle";
  this.speed = spd;
}

/**
  * @function Update
  * Updates the Boss based on the supplied input
  * @param {DOMHighResTimeStamp} elapedTime
  */
Boss.prototype.update = function(elapsedTime) {
  var isModSpd = (elapsedTime % this.speed == 0);
  var timer;
  if(state == "idle"){
    timer = 0;
    if(isModSpd){
      timer++;
    }
    if(timer == 2*this.speed){
      state = "attack";
    }
  }
  if(state == "attack"){
    Attack();
    state = "wait to move";
  }
  if(state == "wait to move"){
    timer = 0;
    if(isModSpd){
      timer++;
    }
    if(timer == spd){
      state = "move";
    }
  }
  if(state == "move"){
    Move();
    state = "wait to attack";
  }
  if(state == "wait to attack"){
    timer = 0;
    if(isModSpd){
      timer++;
    }
    if(timer == spd){
      state = "attack";
    }
  }
}

Attack(){

}

Move(){

}

/**
 * @function render
 * Renders the Boss in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Boss.prototype.render = function (elapsedTime, ctx) {
ctx.clear();
  if(state == "attack"){
    ctx.style = "red";
  }
  else if(state == "move"){
    ctx.style = "blue";
  }
  else{
    ctx.style = "purple";
  }
  ctx.drawRect();
}
