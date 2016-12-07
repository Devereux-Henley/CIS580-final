"use strict";

const json = require('assets/map/collision-test.json');
const SpawnLocation = require('/spawnLocation.js');

/**
 * @module exports the Map class
 */
module.exports = exports = SpawnManager;

/**
 * @constructor SpawnManager
 * Creates a new SpawnManager object
 */
function SpawnLocation(position, type) {
  this.x = position.x;
  this.y = position.y;
  this.Type = type;
}
