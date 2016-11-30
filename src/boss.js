"use strict";

const BOSS_SIZE = 96;
const BOSS_SPEED = 3;

/**
  * @module Boss
  * A class representing a boss in the game
  */
module.exports = exports = Boss;

/**
  * @constructor Boss
  * Creates a Boss
  */
function Boss(position, state, size) {
  this.size = BOSS_SIZE / size;
  this.speed = BOSS_SPEED;
  this.tag = "blob";
  this.position = position;
  this.state = state;
}

/**
  * @function Update
  * Updates the Boss based on the supplied input
  * @param {DOMHighResTimeStamp} elapedTime
  */
Boss.prototype.update = function(elapsedTime) {

}

/**
 * @function render
 * Renders the Boss in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Boss.prototype.render = function (elapsedTime, ctx) {

}

/**
 * @function onCollision
 * @param  {entity} entity The opposing entity this Boss is colliding with
 */
Boss.prototype.onCollision = function(entity) {

}
