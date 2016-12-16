"use strict";

/* Classes and Libraries */
const Vector = require('./vector');

/* Constants */
const MISSILE_SPEED = 8;

/**
 * @module Missile
 * A class representing a player's missile
 */
module.exports = exports = Missile;

/**
 * @constructor Missile
 * Creates a missile
 * @param {Vector} position the position of the missile
 * @param {Object} target the target of the missile
 */
function Missile(position, target) {
  this.position = {x: position.x, y:position.y}
  this.target = {x: target.x, y: target.y};
  this.angle = 0;
}

/**
 * @function update
 * Updates the missile, steering it towards a locked
 * target or straight ahead
 * @param {DOMHighResTimeStamp} elapedTime
 */
Missile.prototype.update = function(elapsedTime) {

  // set the velocity
  var velocity = {x: MISSILE_SPEED, y: 0}
  var direction = Vector.subtract(this.position, this.target);
  velocity = Vector.scale(Vector.normalize(direction), MISSILE_SPEED);

  // determine missile angle
  //this.angle = Math.atan2(velocity.y, velocity.x);

  // move the missile
  this.position.x += velocity.x;
  this.position.y += velocity.y;
}
/**
 * @function render
 * Renders the missile in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Missile.prototype.render = function(elapsedTime, ctx) {
  // Draw Missile
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(this.position.x, this.position.y, 20, 0, 2*Math.PI);
  ctx.fill();
  ctx.restore();
}

Missile.prototype.onCollision = function(entity){
  //will make when merge collisions
}
