"use strict;"

const SPIKE_TAG = "spike";
const SPIKE_SHAPE = "square";
const SPIKE_SIZE = 64;

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
  this.renderSource = new Image();
  this.renderSource.src = 'assets/spike.png';
  this.position = position;
  this.shape = "square";
  this.weight, this.height = 64;
  this.triggered = false;
}

Spike.prototype.update = function(elapsedTime) {

}

Spike.prototype.render = function(elapsedTime, ctx) {
  if (this.triggered) {
    ctx.drawImage(this.renderSource, this.position.x, this.position.y);
  }
}

Spike.prototype.onCollision = function(entity) {

}
