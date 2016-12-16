const Player = require('./player');
const Map = require('./map');
const Gui = require('./gui');
const img = new Image();
img.src = 'assets/level_creepy_crawler/crawler.png';
var map = new Map.Map(2, require('../assets/map/bossmap1.json'));
var playerGettingHit = new Audio();
playerGettingHit.src = "assets/boulderHittingWall.wav";
var bossGettingHitByBullet = new Audio();
bossGettingHitByBullet.src = "assets/beatBoss.wav";
var bossFiringBullet = new Audio();
bossFiringBullet.src = "assets/bossGettingHit.wav";

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

  constructor(x, y, target, owner, gui) {
    this.gui = gui;
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
      playerGettingHit.play();
      this.target.damage();
      console.log(this.gui);
      this.gui.damage();
      return false;
    }
    if(checkcircle(this, this.owner)) {
      console.log("boss was hit!");
      this.owner.radius -= 3;
      this.owner.omega *= 1.05;
      this.owner.maxTime *= 0.95;
      bossGettingHitByBullet.play();
      console.log(this.owner.radius);
      return false;
    }
    return this.timer < 5000;
  }
}

class MissleDude {

  constructor(player, gui) {
    this.gui = gui;
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
    ctx.save()
    ctx.translate(this.x - this.radius, this.y - this.radius);
    ctx.drawImage(img, 0, 0, 120, 120, 0, 0, this.radius * 2, this.radius * 2);
    ctx.restore();
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
      bossFiringBullet.play();
      this.missles.push(new Missle(
        this.x + diffx / mag * rad,
        this.y + diffy / mag * rad,
        this.player, this, this.gui));
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
        return this.player.health <= 0;
    }

    hasWon()/*: bool */ {
        return this.boss.radius < 7;
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
    }

    start() {
      this.player = new Player({x: 500, y: 500});
      this.player.width = 24;
      this.player.height = 32;
      this.gui = new Gui(this.player);
      this.boss = new MissleDude(this.player, this.gui);

    }

    getTitle()/*: string */ {
        return "Missle Bro";
    }
}

module.exports = MissleLevel;
