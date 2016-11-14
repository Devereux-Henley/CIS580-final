"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Collision;

Collision.prototype.checkForSingleSquareCollision = function(entity1, entity2)
 {
  var collides = !(entity1.x + entity1.width < entity2.x ||
                   entity1.x > entity2.x + entity2.width ||
                   entity1.y + entity1.height < entity2.y ||
                   entity1.y > entity2.y + entity2.height);
  if(collides) {
    return true;
  }
}

Collision.prototype.checkForSingleCircleCollision = function(entity1, entity2)
{
    var distSquared =
      Math.pow(entity1.position.x - entity2.position.x, 2) +
      Math.pow(entity1.position.y - entity2.position.y, 2);
    // (15 + 15)^2 = 900 -> sum of two balls' raidius squared
    var sumRadiusSqueared = (entity1.radius * entity1.radius) + (entity2.radius * entity2.radius);
    if(distSquared < sumRadiusSqueared)
  {
    return true;
  }
}
