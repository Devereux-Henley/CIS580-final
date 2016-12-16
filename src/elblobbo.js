const Player = require('./player');
const Map = require('./map');
const Gui = require('./gui');
var map = new Map.Map(1, require('../assets/map/bossmap1.json'));

//ripped from:
//http://gamedev.stackexchange.com/questions/586/what-is-the-fastest-way-to-work-out-2d-bounding-box-intersection
function checkbox(a, b) {
  return (Math.abs(a.x - b.x) * 2 < (a.width + b.width)) &&
         (Math.abs(a.y - b.y) * 2 < (a.height + b.height));
}

function checkcircle(a, b) {
  let diffx = a.x - b.x;
  let diffy = a.y - b.y;
  let dist2 = diffx*diffx + diffy*diffy;
  let maxd = a.radius + b.radius;
  return dist2 < maxd*maxd;
}

function checkCircleBox(circle, box) {
  //pretend like the box is a circle
  return checkcircle(circle,
    {x:box.x+box.width/2, y:box.y+box.height/2, radius:box.width/2}
  );
}

const SPIKE_TAG = "spike";
const SPIKE_SHAPE = "square";
const SPIKE_SIZE = 64;

class Spike {
  constructor(x, y) {
    this.tag = "spike";
    this.renderSource = new Image();
    this.renderSource.src = 'assets/spike.png';
    this.x = x;
    this.y = y;
    this.shape = "square";
    this.width = 64;
    this.height = 64;
    this.triggered = true;
  }
  update(dt) {

  }
  render(dt, ctx) {
    if (this.triggered) {
      ctx.drawImage(this.renderSource, this.x, this.y, this.width, this.height);
    }
  }
}

class Tile {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }
  update(dt) { }
  render(dt, ctx) { }
}

String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}

function toColor(color) {
  return "#" + color[0].toString(16).lpad("0", 2)
             + color[1].toString(16).lpad("0", 2)
             + color[2].toString(16).lpad("0", 2);
}

class ElBlobbo {

  constructor(player, gui) {
    this.gui = gui;
    this.x = 300;
    this.y = 300;
    this.color = [0, 255, 0];
    this.radius = 100;
    this.player = player;
    this.timer = 0;
    this.spikes = [];
    this.health = 5;
    this.renderSource = new Image();
    this.renderSource.src = "assets/el_blobbo/blob5.png";
  }

  render(dt, ctx) {
    ctx.save();

    ctx.translate(-100, -100);
    ctx.drawImage(
      this.renderSource,
      this.x, this.y, this.radius*2, this.radius*2
    );

    ctx.restore();
  }

  update(dt) {
    let speed = 0.12;
    let diffx = this.player.x - this.x;
    let diffy = this.player.y - this.y;
    let mag = Math.sqrt(diffx*diffx + diffy*diffy);
    this.x += speed * dt * diffx / mag;
    this.y += speed * dt * diffy / mag;
  }

  transform() {
    // this.renderSource = new Image();
    this.renderSource.src = "assets/el_blobbo/blob" + this.health + ".png";
  }

}

class ElBlobboLevel {

    construct() {

    }

    hasEnded()/*: bool */ {
        return this.player.health <= 0 || this.hasWon();
    }

    hasWon()/*: bool */ {
        return this.boss.color[1] <= 0;
    }

    update(dt/*: number */) {
      this.player.update(dt);
      this.player.x = this.player.position.x;
      this.player.y = this.player.position.y;
      this.boss.update(dt);

      if(checkCircleBox(this.boss, this.player)) {
        console.log("it done did it");
        let diffx = this.player.x - this.boss.x;
        let diffy = this.player.y - this.boss.y;
        let mag = Math.sqrt(diffx*diffx + diffy*diffy);
        this.player.position.x += 30 * diffx / mag;
        this.player.position.y += 30 * diffy / mag;
        console.log(this.player.x, this.player.y);
        this.player.damage();
        this.gui.damage();
      }

      let toRemove = [];
      this.spikes.forEach((s) => {
        if(checkCircleBox(this.boss, s)) {
          this.boss.color[0] = Math.min(this.boss.color[0] + 55, 255);
          this.boss.color[1] = Math.max(this.boss.color[1] - 55, 0);
          if (this.boss.health != 1) {
            this.boss.health--;
            this.boss.transform();
          }
          toRemove.push(s);
        }
      });
      for(let spike of toRemove) {
        this.spikes.splice(this.spikes.indexOf(spike), 1);
      }
    }

    render(dt/*: number */, ctx/*: CanvasRenderingContext2D */) {
      map.getLayers().forEach((layer) => layer.render(ctx));
      this.spikes.forEach((s) => s.render(dt, ctx));
      this.player.render(dt, ctx);
      this.boss.render(dt, ctx);
      this.gui.render(dt, ctx);
    }

    start() {
      this.player = new Player({x: 500, y: 500});
      this.spikes = [
        new Spike(16 * 8, 9 * 16),
        new Spike(16 * 52, 9 * 16),
        new Spike(16 * 8, 36 * 16),
        new Spike(16 * 52, 36 * 16),
        new Spike(30 * 16, 22 * 16)
      ];
      this.player.width = 24;
      this.player.height = 32;
      this.gui = new Gui(this.player);
      this.boss = new ElBlobbo(this.player, this.gui);

    }

    getTitle()/*: string */ {
        return "El Blobbo";
    }
}

module.exports = ElBlobboLevel;
