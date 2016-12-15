"use strict";

const Vector = require('./vector')

const BOSS_SIZE = 32;
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
  this.size = BOSS_SIZE * size;
  this.speed = BOSS_SPEED;
  this.tag = "boss2";
  this.shape = "circle";
  this.position = position;
  this.velocity = {x: 0, y: 0};
  this.immune = false;
}

/**
  * @function Update
  * Updates the Boss based on the supplied input
  * @param {DOMHighResTimeStamp} elapedTime
  */
Boss.prototype.update = function(elapsedTime, playerPosition) {
  // Follow player
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
  // console.log("boss is colliding");
  switch (entity.tag) {
    case "spike":
      if (entity.triggered && !this.immune) {
        size--;
        this.immune = true;
      }
      break;
    default:
      this.immune = false;
      break;
  }
}
