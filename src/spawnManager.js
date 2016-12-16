"use strict";

// const json = require('assets/map/collision-test.json');
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
  this.objects = [];
  this.associations = {};
}

SpawnManager.prototype.getLocations = function(layers) {
  for (var i = 0; i < layers.length; i++) {

    if(layers[i].properties.spawning){
      for (var j = 0; j < layers[i].objects.length; j++) {
        if(layers[i].objects[j].properties.Spawn){
           var position = {
            x: layers[i].objects[j].x + (layers[i].objects[j].width / 2),
            y: layers[i].objects[j].y + (layers[i].objects[j].height / 2)
          }
          var spawner = this.associations[layers[i].objects[j].type];

          this.objects.push(spawner.new(layers[i].objects[j]));
        }
      }
    }
  }
}

SpawnManager.prototype.addAssociation = function(type, spawner){
  if(this.associations[type] == null){
    this.associations[type] = spawner;
  }
  else {
    throw "Type can only reference 1 type of spawner.";
  }
}

SpawnManager.prototype.update = function(deltaTime){
  this.objects.forEach(function(obj) {
    obj.update(deltaTime);
  });
}

SpawnManager.prototype.render = function(deltaTime, ctx){
  this.objects.forEach(function(obj) {
    obj.render(deltaTime, ctx);
  });
}
