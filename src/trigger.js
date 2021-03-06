"use strict;"

/**
 * @module Trigger
 * A class representing a tile map object
 */
module.exports = exports = Trigger;

/**
 * @constructor Trigger
 * @param {Position} position Where Trigger will be located on map
 */
function Trigger(position) {
  this.tag = "trigger";
  this.shape = "square";
  // x: 464 (29 tiles), y: 336 (21 tiles)
  this.position = position;
  this.active = false;
  this.renderSource = new Image();
  this.renderSource.src = 'assets/trigger_active.png';
}

Trigger.prototype.update = function(elapsedTime) {

}

Trigger.prototype.render = function(elapsedTime, ctx) {
  if (this.active) {
    ctx.drawImage(this.renderSource, this.position.x, this.position.y);
  }
}

Trigger.prototype.onCollision = function(entity) {
  switch(entity.tag) {
    case "player":
      this.active = true;
      break;
    default:
      this.active = false;
      break;
  }
}
