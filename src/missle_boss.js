const Player = require('./player');
const Map = require('./map');
const Gui = require('./gui');
var map = new Map.Map(2, require('../assets/map/bossmap1.json'));

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

class Missle {

  constructor(x, y, target, owner) {
    this.x = x;
    this.y = y;
    this.radius = 1;
    this.width = 1;
    this.height = 1;
    this.target = target;
    this.owner = owner;
    this.timer = 0;
  }

  render(dt, ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
  }

  update(dt) {
    this.timer += dt;
    let speed = 0.1;
    let x = this.target.x + this.target.width / 2;
    let y = this.target.y + this.target.height / 2;
    let diffx = x - this.x;
    let diffy = y - this.y;
    let mag = Math.sqrt(diffx*diffx + diffy*diffy);
    this.x += speed * dt * diffx / mag;
    this.y += speed * dt * diffy / mag;
    if(checkbox(this, this.target)) {
      console.log("player was hit!");
      return false;
    }
    if(checkcircle(this, this.owner)) {
      console.log("boss was hit!");
      this.owner.radius -= 3;
      this.owner.omega *= 1.05;
      this.owner.maxTime *= 0.95;
      return false;
    }
    return this.timer < 5000;
  }
}

class MissleDude {

  constructor(player) {
    this.x = 200;
    this.y = 200;
    this.radius = 30;
    this.player = player;
    this.missles = [];
    this.timer = 0;
    this.theta = 0;
    this.omega = 0.0005;
    this.maxTime = 2000;
  }

  render(dt, ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'green';
    ctx.fill();
    this.missles.forEach((m) => m.render(dt, ctx));
  }

  update(dt) {
    //let omega = 0.0005;
    this.timer += dt;
    this.theta += this.omega * dt;
    this.x = 200*Math.cos(this.theta) + 512;
    this.y = 200*Math.sin(this.theta) + 784/2;
    if(this.timer > this.maxTime) {
      let rad = 40;
      let diffx = this.player.x - this.x;
      let diffy = this.player.y - this.y;
      let mag = Math.sqrt(diffx*diffx + diffy*diffy);
      this.timer -= 2000;
      this.missles.push(new Missle(
        this.x + diffx / mag * rad,
        this.y + diffy / mag * rad, this.player, this));
    }
    let newMissles = [];
    this.missles.forEach((m) => {
      if(m.update(dt)) {
        newMissles.push(m);
      }
    });
    this.missles = newMissles;
  }

}

class MissleLevel {

    construct() {

    }

    hasEnded()/*: bool */ {
        return false;
    }

    hasWon()/*: bool */ {
        return ;
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
    }

    start() {
      this.player = new Player({x: 500, y: 500});
      this.player.width = 24;
      this.player.height = 32;
      this.boss = new MissleDude(this.player);
      this.gui = new Gui(this.player);
    }

    getTitle()/*: string */ {
        return "Missle Bro";
    }
}

module.exports = MissleLevel;
