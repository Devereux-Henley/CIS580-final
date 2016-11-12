"use strict";

const json = require('assets/map/collision-test.json');
const SpawnLocation = require('./spawnLocation.js');

/**
 * @module exports the Map class
 */
module.exports = exports = SpawnManager;

/**
 * @constructor SpawnManager
 * Creates a new SpawnManager object
 */
function SpawnManager() {
  this.locations = [];
  this.associations = {};
}

function getLocations(layers) {
  for (var i = 0; i < layers.length; i++) {
    if(layers[i].spawning){
      for (var j = 0; j < layers[i].objects.length; j++) {
        if(layers[i].objects[j].Spawn){
           var position = {
            x: layers[i].objects[j].x + (layers[i].objects[j].width / 2),
            y: layers[i].objects[j].y + (layers[i].objects[j].height / 2)
          }
          addLocation(position, layers[i].objects[j].Type);
        }
      }
    }
  }
}

function addLocation(position, type){
  this.locations.push(new SpawnLocation(position, type));
}

function addAssociation(type, spawner){
  if(this.associations[type] == null){
    this.associations[type] = spawner;
  }
  else {
    throw "Type can only reference 1 type of spawner.";
  }
}

function update(){
  for (var i = 0; i < locations.length; i++) {
    associations[locations[i].Type].update();
  }
}
