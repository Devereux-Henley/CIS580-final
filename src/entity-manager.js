"use strict";

const Collision = require('./collision');

/**
 *
 */
module.exports = exports = EntityManager;

function EntityManager(width, height, cellSize) {
    this.cellSize = cellSize;
    this.widthInCells = Math.ceil(width / cellSize);
    this.heightInCells = Math.ceil(height / cellSize);
    this.cells = [];
    this.numberOfCells = this.widthInCells * this.heightInCells;
    for (var i = 0; i < this.numberOfCells; i++) {
        this.cells[i] = [];
    }
    this.cells[-1] = [];
}

EntityManager.prototype.getIndex = function(x, y) {
  var x = Math.floor(x / this.cellSize);
  var y = Math.floor(y / this.cellSize);
  if(x < 0 ||
     x >= this.widthInCells ||
     y < 0 ||
     y >= this.heightInCells
  ) return -1;
  return y * this.widthInCells + x;
}

EntityManager.prototype.addEntity = function(entity){
  var index = getIndex.call(this, entity.x, entity.y);
  this.cells[index].push(entity);
  entity._cell = index;
}

EntityManager.prototype.removeEntity = function(entity) {
  var cellIndex = this.cells[entity._cell].indexOf(entity);
  if(cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
  entity._cell = undefined;
}

EntityManager.prototype.update = function(entity) {
  this.cells.forEach(function(cell) {
    cells.forEach(function(entity){
      entity.update(elapsedTime);
      var index = cellIndex(entity);
      if (index != entity._cell) {
        // Remove from old cell
        var subIndex = this.cells[entity._cell].indexOf(entity);
        if(subIndex != -1) this.cells[entity._cell].splice(subIndex, 1);
        // Place in new cell
        this.cells[index].push(entity);
        entity._cell = index;
      }
    });
  });
}
