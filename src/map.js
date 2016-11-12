"use strict";

const json = require('assets/map/test.json');

/**
 * @module exports the Map class
 */
module.exports = exports = Map;

/**
 * @constructor Map
 * Creates a new map object
 */
function Map() {
  this.json = json;
  
}

/**
 * @constructor Tileset
 * Defines a renderable tileset
 */
function Tileset(img, h, w, cols, margin, spacing) {
  this.tileheight = h;
  this.tilewidth = w;
  this.colums = cols;
  this.img = new Image();
  this.img.src = img;
  this.margin = margin;
  this.spacing = spacing;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {int} id the tile number to be rendered
 * @param {CanvasRenderingContext2D} ctx the context to be rendered to
 */
Tileset.prototype.render = function(id, ctx) {
  if(id == 0) return; //don't render if empty
  id = id - 1; //now normalize
  var xstep = this.tilewidth + this.spacing;
  var ystep = this.tileheight + this.spacing;
  var yid = Math.floor(id / this.columns); //the y location
  var xid = id % this.columns; //the x location
  var xpix = xid * xstep; //x pixel location
  var ypix = yid * ystep; //y pixel location
  ctx.drawImage(this.img,
                xpix, ypix,
                this.tilewidth, this.tileheight,
                0, 0,
                this.tilewidth, this.tileheight);
}
