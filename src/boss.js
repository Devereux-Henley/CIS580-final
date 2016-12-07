"use strict";

const Vector = require('./vector')

const BOSS_SIZE = 48;
const BOSS_SPEED = 2;

/**
  * @module Boss
  * A class representing a boss in the game
  */
module.exports = exports = Boss;

/**
  * @constructor Boss
  * Creates a Boss
  */
function Boss(position, size) {
  this.size = BOSS_SIZE / size;
  this.speed = BOSS_SPEED;
  this.tag = "blob";
  this.position = position;
  // this.state = state;
  this.velocity = {x: 0, y: 0};
}

/**
  * @function Update
  * Updates the Boss based on the supplied input
  * @param {DOMHighResTimeStamp} elapedTime
  */
Boss.prototype.update = function(elapsedTime, playerPosition) {
  var direction = Vector.subtract(playerPosition, this.position);
  this.velocity = Vector.scale(Vector.normalize(direction), this.speed);
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
}

/**
 * @function render
 * Renders the Boss in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Boss.prototype.render = function (elapsedTime, ctx) {
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.arc(this.position.x, this.position.y, this.size, 0, 2*Math.PI);
  ctx.fill();
}

Boss.prototype.onCollision = function(entity) {

}
