"use strict";

/**
 * @module exports the Map class
 */
module.exports = exports = {Map:Map, Tile:Tile, Tileset:Tileset};

/**
 * @constructor Map
 * Creates a new map object
 */
function Map(scale, data) {
  this.json = data;
  if(!scale) scale = 1.0;
  this.scale = Math.sqrt(scale);
  this.tilewidth = this.json.tilewidth;
  this.tileheight = this.json.tileheight;
  //construct the tilesets
  this.tilesets = [];
  var self = this;
  this.json.tilesets.forEach(function (set) {
    self.tilesets.push(new Tileset(
      set.image,
      set.tilewidth,
      set.tileheight,
      set.columns,
      set.firstgid,
      set.tilecount,
      set.margin,
      set.spacing
    ));
  });
  //construct the layers
  this.layers = [];
  this.objlayers = [];
  this.json.layers.forEach(function(layer) {
    if(!layer.data) {
      self.objlayers.push(layer);
      return;
    }
    var map = [];
    for(var i = 0; i < layer.width; ++i) {
      map.push([]);
      for(var j = 0; j < layer.height; ++j) {
        var k = 0;
        var datum = layer.data[j * layer.width + i];
        if(datum == 0) map[i].push(new NullTile());
        else {
          //console.log(datum, self);
          while(!self.tilesets[k].isfromthis(datum)) {
            //console.log(self.tilesets[k]);
            ++k;
          }
          map[i].push(new Tile(self.tilesets[k], datum));
        }
      }
    }
    self.layers.push(new Layer(map, self));
  });
}

/**
 * @function getLayers
 * gets all the layers of a mpa
 */
Map.prototype.getLayers = function() {
  return this.layers;
}

 /**
  * @constructor Layer
  * contains layer information
  */
 function Layer(map, owner) {
   this.map = map;
   this.owner = owner;
 }

 /**
  * @function render
  * Renders a whole layer
  * @param {CanvasRenderingContext2D} ctx the context to be rendered to
  */
 Layer.prototype.render = function(ctx) {
   ctx.save();
   ctx.scale(this.owner.scale, this.owner.scale);
   for(var i = 0; i < this.map.length; ++i) {
     ctx.save();
     for(var j = 0; j < this.map[i].length; ++j) {
       this.map[i][j].render(ctx);
       ctx.translate(0, this.owner.tileheight);
     }
     ctx.restore();
     ctx.translate(this.owner.tilewidth, 0);
   }
   ctx.restore();
 }

 /**
  * @function render
  *
  * @param {int} x the x location of the tile
  * @param {int} y the y location of the tile
  */
  Layer.prototype.getTile = function(x, y) {
    var tile = this.map[x][y];
    return new Tile(this.tileset, this.id);
  }

/**
 * @constructor Tile
 * Defines a renderable tile
 */
function Tile(tileset, id) {
  this.tileset = tileset;
  this.id = id;
}

/**
 * @function render
 * renders a tile object
 * @param {CanvasRenderingContext2D} ctx the context to be rendered to
 */
Tile.prototype.render = function(ctx) {
  //console.log()
  this.tileset.render(this.id, ctx);
}


/**
 * @constructor NullTile`
 * Defines a tile object
 */
function NullTile(tileset, id) {
  this.tileset = tileset;
  this.id = id;
}

/**
 * @function render
 * renders a tile object
 * @param {CanvasRenderingContext2D} ctx the context to be rendered to
 */
NullTile.prototype.render = function(ctx) {
  //do nothing cuz this isn't a real tile
}

/**
 * @constructor Tileset
 * Defines a renderable tileset
 */
function Tileset(img, h, w, cols, first, count, margin, spacing) {
  this.first = first;
  this.count = count;
  this.tileheight = h;
  this.tilewidth = w;
  this.columns = cols;
  this.img = new Image();
  this.img.src = "assets/map/" + img; //hardcoded
  this.margin = margin;
  this.spacing = spacing;
}

/**
 * @function isfromthis
 * checks if a tile is from this tile
 * @param {int} id the tile number to be rendered
 */
Tileset.prototype.isfromthis = function(id) {
  //console.log(this.first, id, this.count)
  return this.first <= id && id < this.first + this.count
}

/**
 * @function render
 * renders a single tile out of a tileset
 * @param {int} id the tile number to be rendered
 * @param {CanvasRenderingContext2D} ctx the context to be rendered to
 */
Tileset.prototype.render = function(id, ctx) {
  id = id - this.first; //now normalize
  var xstep = this.tilewidth + this.spacing;
  var ystep = this.tileheight + this.spacing;
  var yid = Math.floor(id / this.columns); //the y location
  var xid = id % this.columns; //the x location
  var xpix = xid * xstep; //x pixel location
  var ypix = yid * ystep; //y pixel location
  //console.log(id, xid, yid, this);
  //asdf.asdf();
  ctx.drawImage(this.img,
                xpix, ypix,
                this.tilewidth, this.tileheight,
                0, 0,
                this.tilewidth, this.tileheight);
}
