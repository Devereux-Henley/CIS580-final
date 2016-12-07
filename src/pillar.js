"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the create class
 */
module.exports = exports = Pillar;

/**
 * @constructor crate
 * Creates a new crate object
 * @param {Postition} position object specifying an x and y
 */
function Pillar(point) {
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/pillar.png');
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
  this.position = {
    x: position.x ,
    y: position.y
  }
  this.height = 32;
  this.width = 32;
  this.shape = "square";
  this.radius = 16;
  this.tag = "pillar";
}

Pillar.prototype.onCollision = function(entity)
{
  switch(entity.tag)
  {
    case "spear":

      break;
    case "create":

      break;
    case "boulder":

      break;
    case "player":

      break;
    default:
      console.log("Invalide collision")
      break;
  }
}

/**
 * @function updates the crate object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Pillar.prototype.update = function(time)
{

}

/**
 * @function renders the crate into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Pillar.prototype.render = function(time, ctx) {
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
