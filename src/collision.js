"use strict";

const MS_PER_FRAME = 1000/8;
const Vector = require('./vector');

/**
 * @module exports the Collision class
 */
module.exports = exports = {
  checkForSingleSquareCollision: checkForSingleSquareCollision,
  checkForSingleCircleCollision: checkForSingleCircleCollision,
  checkForShapeCollision: checkForShapeCollision
};

/**
 * Check for collision between two square objects
 *
 * @param {entity1} The first entity
 * @param {entity2} The second entity
 */
function checkForSingleSquareCollision(entity1, entity2)
 {
   var collides = !(entity1.x + entity1.width < entity2.x ||
                   entity1.x > entity2.x + entity2.width ||
                   entity1.y + entity1.height < entity2.y ||
                   entity1.y > entity2.y + entity2.height);

   if(collides) {
     if(entity1.tag == "player") console.log(entity1);
     if(entity2.tag == "player") console.log(entity2);
     return true;
  }
}

/**
 * Check for collision between two circle objects
 *
 * @param {entity1} The first entity
 * @param {entity2} The second entity
 */
function checkForSingleCircleCollision(entity1, entity2)
{
    var distSquared =
      Math.pow(entity1.x - entity2.x, 2) +
      Math.pow(entity1.y - entity2.y, 2);
    // (15 + 15)^2 = 900 -> sum of two balls' raidius squared
    var sumRadiusSqueared = (entity1.radius * entity1.radius) + (entity2.radius * entity2.radius);
    if(distSquared < sumRadiusSqueared)
  {
    return true;
  }
}

/**
 * Check for collision between complex shapes
 *
 * @param {entity1} The first entity
 * @param {entity2} The second entity
 */
function checkForShapeCollision(entity1, entity2) {
    var axes = Vector.findAxes(entity1.points) + Vector.findAxes(entity2.points);
    for(var i = 0; i < axes.length; i++) {
        var proj1 = Vector.project(entity1.points, axes[i]);
        var proj2 = Vector.project(entity2.points, axes[i]);
        if(proj1.max < proj2.min || proj1.min > proj2.max) {
            return false;
        }
    }
    return true;
}
