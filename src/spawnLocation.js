"use strict";

// const json = require('assets/map/collision-test.json');

/**
 * @module exports the Map class
 */
module.exports = exports = SpawnLocation;

/**
 * @constructor SpawnManager
 * Creates a new SpawnManager object
 */
function SpawnLocation(position, type) {
  this.x = position.x;
  this.y = position.y;
  this.Type = type;
}
