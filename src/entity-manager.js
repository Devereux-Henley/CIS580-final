"use strict";

const Collision = require('./collision');

/**
 * @module exports an EntityManager class
 */
module.exports = exports = EntityManager;

/**
 * Entity Manager Constructor
 *
 * Each entity added to manager must have a collision method:
 * Example: entity1.onCollision(entity2)
 * The Entity must have the following properities for collisions to work:
 *    .shape which will be of the type string ("square" or "circle" or "complex")
 *    .tag which will be the string name of the object ("player" or "boss1" or ...)
 *    .points which is an array of points [{x: x1, y: y1}, ..., {x: xn, y: yn}]
 *      "square" shapes will need 4 points
 *      "circle" shapes will need 4 points top, bottom, leftSide, rightSide
 *      "complex" shapes can have n number of points
 *
 * @param {width} The width of the canvas
 * @param {height} The height of the canvas
 * @param {cellsize} The size of the cell
 */
function EntityManager(width, height, cellSize) {
  this.cellSize = cellSize;
  this.widthInCells = Math.ceil(width / cellSize);
  this.heightInCells = Math.ceil(height / cellSize);
  this.cells = [];
  this.numberOfCells = this.widthInCells * this.heightInCells;
  for(var i = 0; i < this.numberOfCells; i++) {
    this.cells[i] = [];
  }
  this.cells[-1] = [];
}

/**
 * Finds the index of the entity based on the
 * x and y position of the entity.
 *
 * @param {x} The x position
 * @param {y} The y position
 * @return The index of the entity
 */
function getIndex(x, y) {
  var x = Math.floor(x / this.cellSize);
  var y = Math.floor(y / this.cellSize);
  if(x < 0 ||
     x >= this.widthInCells ||
     y < 0 ||
     y >= this.heightInCells
  ) return -1;
  return y * this.widthInCells + x;
}

/**
 * Method to add an Entity to the Manager
 *
 * @param {entity} The entity to add to the manager
 */
EntityManager.prototype.addEntity = function(entity){
  var index = getIndex.call(this, entity.position.x, entity.position.y);
  this.cells[index].push(entity);
  entity._cell = index;
}

EntityManager.prototype.updateEntity = function(entity){
  var index = getIndex.call(this, entity.position.x, entity.position.y);
  // If we moved to a new cell, remove from old and add to new
  if(index != entity._cell) {
    var cellIndex = this.cells[entity._cell].indexOf(entity);
    if(cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
    this.cells[index].push(entity);
    entity._cell = index;
  }
}

/**
 * Method to remove entity from the manager
 *
 * @param {entity} The entity to be removed from the manager
 */
EntityManager.prototype.removeEntity = function(entity) {
  var cellIndex = this.cells[entity._cell].indexOf(entity);
  if(cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
  entity._cell = undefined;
}

/**
 * Method to check for collisions
 * When collision detected between two entitities
 * and the entity's onCollision method is called
 * taking the other entity as a param.
 */
EntityManager.prototype.collide = function() {
  var self = this;
  this.cells.forEach(function(cell, i) {
    // test for collisions
    cell.forEach(function(entity1) {
      // check for collisions with cellmates
      cell.forEach(function(entity2) {
        if(entity1 != entity2) {
          if(entity1.shape == "square" || entity2.shape == "square") {
            if(Collision.checkForSingleSquareCollision(entity1, entity2)) {
              // Call entity collision methods
              entity1.onCollision(entity2);
              entity2.onCollision(entity1);
            }
          }
          else if(entity1.shape == "circle" && entity2.shape == "circle") {
            if(Collision.checkForSingleCircleCollision(entity1, entity2)) {
              // Call entity collision methods
              entity1.onCollision(entity2);
              entity2.onCollision(entity1);
            }
          }
          else if(entity1.shape == "complex" || entity2.shape == "complex") {
            if(Collision.checkForSingleSquareCollision(entity1, entity2)) {
              if(Collision.checkForShapeCollision(entity1, entity2)) {
                // Call entity collision methods
                entity1.onCollision(entity2);
                entity2.onCollision(entity1);
              }
            }
          }
        }

        // check for collisions in cell to the right
        if(i % (self.widthInCells - 1) != 0) {
          self.cells[i+1].forEach(function(entity2) {
            if(entity1.shape == "square" || entity2.shape == "square") {
              if(Collision.checkForSingleSquareCollision(entity1, entity2)) {
                // Call entity collision methods
                entity1.onCollision(entity2);
                entity2.onCollision(entity1);
              }
            }
            else if(entity1.shape == "circle" && entity2.shape == "circle") {
              if(Collision.checkForSingleCircleCollision(entity1, entity2)) {
                // Call entity collision methods
                entity1.onCollision(entity2);
                entity2.onCollision(entity1);
              }
            }
            else if(entity1.shape == "complex" || entity2.shape == "complex") {
              if(Collision.checkForSingleSquareCollision(entity1, entity2)) {
                if(Collision.checkForShapeCollision(entity1, entity2)) {
                  // Call entity collision methods
                  entity1.onCollision(entity2);
                  entity2.onCollision(entity1);
                }
              }
            }
          });
        }

        // check for collisions in cell below
        if(i < self.numberOfCells - self.widthInCells) {
          self.cells[i+self.widthInCells].forEach(function(entity2){
            if(entity1.shape == "square" || entity2.shape == "square") {
              if(Collision.checkForSingleSquareCollision(entity1, entity2)) {
                // Call entity collision methods
                entity1.onCollision(entity2);
                entity2.onCollision(entity1);
              }
            }
            else if(entity1.shape == "circle" && entity2.shape == "circle") {
              if(Collision.checkForSingleCircleCollision(entity1, entity2)) {
                // Call entity collision methods
                entity1.onCollision(entity2);
                entity2.onCollision(entity1);
              }
            }
            else if(entity1.shape == "complex" || entity2.shape == "complex") {
              if(Collision.checkForSingleSquareCollision(entity1, entity2)) {
                if(Collision.checkForShapeCollision(entity1, entity2)) {
                  // Call entity collision methods
                  entity1.onCollision(entity2);
                  entity2.onCollision(entity1);
                }
              }
            }
          });
        }

        // check for collisions diagionally below and right
        if(i < self.numberOfCells - self.withInCells && i % (self.widthInCells - 1) != 0) {
          self.cells[i+self.widthInCells + 1].forEach(function(entity2){
            if(entity1.shape == "square" || entity2.shape == "square") {
              if(Collision.checkForSingleSquareCollision(entity1, entity2)) {
                // Call entity collision methods
                entity1.onCollision(entity2);
                entity2.onCollision(entity1);
              }
            }
            else if(entity1.shape == "circle" && entity2.shape == "circle") {
              if(Collision.checkForSingleCircleCollision(entity1, entity2)) {
                // Call entity collision methods
                entity1.onCollision(entity2);
                entity2.onCollision(entity1);
              }
            }
            else if(entity1.shape == "complex" || entity2.shape == "complex") {
              if(Collision.checkForSingleSquareCollision(entity1, entity2)) {
                if(Collision.checkForShapeCollision(entity1, entity2)) {
                  // Call entity collision methods
                  entity1.onCollision(entity2);
                  entity2.onCollision(entity1);
                }
              }
            }
          });
        }
      });
    });
  });
}
