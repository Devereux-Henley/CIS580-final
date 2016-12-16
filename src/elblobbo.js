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
    this.weight, this.height = 64;
    this.triggered = true;
  }
  update(dt) {

  }
  render(dt, ctx) {
    if (this.triggered) {
      ctx.drawImage(this.renderSource, this.x, this.y);
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

class ElBlobbo {

  constructor(player, gui) {
    this.gui = gui;
    this.x = 300;
    this.y = 300;
    this.radius = 100;
    this.player = player;
    this.timer = 0;
    this.spikes = [];
  }

  render(dt, ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'green';
    ctx.fill();
  }

  update(dt) {
    let speed = 0.05;
    let diffx = this.player.x - this.x;
    let diffy = this.player.y - this.y;
    let mag = Math.sqrt(diffx*diffx + diffy*diffy);
    this.x += speed * dt * diffx / mag;
    this.y += speed * dt * diffy / mag;
  }

}

class ElBlobboLevel {

    construct() {

    }

    hasEnded()/*: bool */ {
        return this.player.health <= 0 || this.hasWon();
    }

    hasWon()/*: bool */ {
        return this.boss.radius < 15;
    }

    update(dt/*: number */) {
      this.player.update(dt);
      this.player.x = this.player.position.x;
      this.player.y = this.player.position.y;
      this.boss.update(dt);
    }

    render(dt/*: number */, ctx/*: CanvasRenderingContext2D */) {
      map.getLayers().forEach((layer) => layer.render(ctx));
      this.player.render(dt, ctx);
      this.boss.render(dt, ctx);
      this.gui.render(dt, ctx);
      this.spikes.forEach((s) => s.render(dt, ctx));
    }

    start() {
      this.player = new Player({x: 500, y: 500});
      this.player.width = 24;
      this.player.height = 32;
      this.gui = new Gui(this.player);
      this.boss = new ElBlobbo(this.player, this.gui);
      this.spikes = [new Spike(16 * 6, 7 * 16)];
    }

    getTitle()/*: string */ {
        return "El Blobbo";
    }
}

module.exports = ElBlobboLevel;
