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
  this.renderResource = new Image();
  this.rednerResource.src = 'assets/spike.png';
  this.position = position;
  this.shape = "square";
  this.size = 64;

}

Spike.prototype.update = function() {

}

Spike.prototype.render = function(ctx, elapsedTime) {
  ctx.drawImage(this.renderSource,
    this.position.x * this.size,
    this.position.y * this.size);
  // ctx.restore();
}

Spike.prototype.onCollision = function() {

}
