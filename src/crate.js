"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the create class
 */
module.exports = exports = Crate;

/**
 * @constructor crate
 * Creates a new crate object
 * @param {Postition} position object specifying an x and y
 */
function Crate(point,direction) {
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/crate.png');
  this.points = [{
    x: position.x,
    y: position.y
  },
  {
    x: position.x + width,
    y: position.y
  },
  {
    x: position.x,
    y: position.y + height
  },
  {
    x: position.x + width,
    y: position.y + height
  }];
  this.height = 32;
  this.width = 32;
  this.direction = direction
  this.shape = "square";
  this.radius = 16;
  this.tag = "crate";
}

Crate.prototype.onCollision = function(entity)
{

}

/**
 * @function updates the crate object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Crate.prototype.update = function(time)
{
  switch(this.direction)
  {
    case "up":
      this.position.y--;
      break;
    case "right":
      this.position.x++;
      break;
    case "down":
      this.position.y++;
      break;
    case "left":
      this.position.x--;
      break;
    default:
      console.log("The direction is invalid");
      console.log("The x position is:" + this.position.x);
      console.log("The y position is:" + this.position.y);
      break;
  }
}

/**
 * @function renders the crate into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Crate.prototype.render = function(time, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        0, 0, this.width, this.height,
        // destination rectangle
        this.width / 2, this.height/2, this.width/2, this.height/2
      );
  ctx.restore();
  }
