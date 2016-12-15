"use strict;"

/**
 * @module Spike
 * A class representing a spike map object
 */
module.exports = exports = Spike;

/**
 * @constructor Spike
 * @param {Position} position Where spike will be located on map
 */
function Spike(position) {
  this.tag = "spike";
  this.Type = "Spike";
  this.Spawn = true;
  this.renderSource = new Image();
  this.rednerSource.src = 'assets/spike.png';
  this.position = position;
  this.shape = "square";
  this.weight, this.height = 64;
  this.triggered = false;
}

Spike.prototype.update = function(trigger) {
  if (trigger.active) {
    this.triggered = true;
  }
}

Spike.prototype.render = function(ctx, elapsedTime) {
  if (this.triggered) {
    ctx.drawImage(this.renderSource, this.position.x, this.position.y);
  }
}

Spike.prototype.onCollision = function(entity) {

}
