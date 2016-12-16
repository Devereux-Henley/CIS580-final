// @flow

const {Level: AbstractLevel} = require("../level_chooser/main");
const {Map} = require("../map");
const Player = require("../player");
const {Gui} = require('../gui');
const vector = require('../vector');
const SpawnManager = require('../SpawnManager');
const mapdata = require('./town_map');
const Boulder = require('../boulder');
/*::
import type {Vector} from "../vector";
*/
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

class Level extends AbstractLevel {
    /*::
    player: Player
    map: Map
    gui: Gui
    boss: Boss
    em: EntityManager
    size: {width: number, height: number}
    */
    constructor(
        size/*: {width: number, height: number} */
    ) {
        super();
        this.size = size;
    }

    start() {
        this.player = new Player({x: 204, y: 204});
        this.player.width = 24;
        this.player.height = 32;
        this.map = new Map(1, mapdata);
        this.gui = new Gui(this.player);
        this.portals = [];
        this.sm = new SpawnManager();
        var self = this;
        var portalSpawn = {
          new: function(portal){

            var myPortal = {
              x: portal.x,
              y: portal.y,
              render:function(dt, ctx) {
                //if(portal.properties.off){
                  //ctx.drawImage('assets/boulder.png',
                    //0, 0, portal.width, portal.height,
                    //portal.width/2,portal.height/2,portal.width/2,portal.height/2);
                //}
              },
              update:function(dt) {
                  //if(collide.boulder){
                  //  portal.off = true;
                  //}
              }
            };
            //console.log(myPortal);
            self.portals.push(myPortal);

        }
      }
      this.sm.addAssociation("Portal",portalSpawn);
      this.sm.getLocations(this.map.objlayers);
      this.boss = new Boss(this.player, this.portals);

    }

    update(dt/*: number */) {
        this.player.update(dt);
        this.player.x = this.player.position.x;
        this.player.y = this.player.position.y;
        this.boss.update(dt);

    }

    render(
        dt/*: number */,
        ctx/*: CanvasRenderingContext2D */
    ) {
        ctx.save();
        ctx.scale(Math.sqrt(6),Math.sqrt(6));
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        for (let layer of this.map.getLayers()) {
            layer.render(ctx);
        }
        this.player.render(dt, ctx);
        this.boss.render(dt, ctx);
        ctx.restore();
        }
    getTitle() {
        return "Town";
    }
}

module.exports = {Level: Level};

class Missile {

  constructor(x, y, target) {
    this.x = x;
    this.y = y;
    this.radius = 1;
    this.width = 1;
    this.height = 1;
    this.target = target;
    this.timer = 0;
  }

  render(dt, ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
  }

  update(dt) {
    this.timer += dt;
    let speed = 0.05;
    let x = this.target.x + this.target.width / 2;
    let y = this.target.y + this.target.height / 2;
    let diffx = x - this.x;
    let diffy = y - this.y;
    console.log("diffs", diffx, diffy);
    let mag = Math.sqrt(diffx*diffx + diffy*diffy);
    console.log("mag", mag);
    this.x += speed * dt * diffx / mag;
    this.y += speed * dt * diffy / mag;
    if(checkbox(this, this.target)) {
      //console.log("player was hit!");
      return false;
    }
    return this.timer < 5000;
  }
}


class Boss {
    constructor(player, portals) {
        this.player = player;
        this.portals = portals;
        this.randPort = this.portals[Math.floor(Math.random()*this.portals.length)];
        this.position = {
          x: this.randPort.x,
          y: this.randPort.y
         };
        this.missiles = [];

        this.timer = 0;
        this.state = "idle";
    }

    render(dt,ctx/*: CanvasRenderingContext2D */) {
        if(this.state == "attack"){
          ctx.fillStyle = "red";
        }
        else if(this.state == "move"){
          ctx.fillStyle = "blue";
        }
        else{
          ctx.fillStyle = "purple";
        }
        ctx.fillRect(this.position.x, this.position.y, 30, 30);
        this.missiles.forEach(function(m){m.render(dt,ctx);});
    }

    update(dt) {
      this.timer += dt;
      switch(this.state){
        case "idle":
        if(this.timer > 1500){
          this.timer = 0;
          this.timer -= 1500;
          this.state = "attack";
        }
        break;
        case "attack":
          console.log(this.player);
          this.missiles.push(new Missile(
            this.position.x,
            this.position.y, this.player));
          this.state = "wait to move";
        break;
        case "move":
          while(this.randPort.x == this.position.x && this.randPort.y == this.position.y){
            this.randPort = this.portals[Math.floor(Math.random()*this.portals.length)];
          }
          this.position = this.randPort;
          this.state = "wait to attack";
        break;
        case "wait to move":

        if(this.timer > 1500){
          this.state = "move";
          this.timer = 0;
          this.timer -= 1500;
        }
        break;
        case "wait to attack":
        if(this.timer > 1500){
          this.state = "attack";
          this.timer = 0;
          this.timer -= 1500;
        }
        break;
    }
    let newMissiles = [];
    this.missiles.forEach((m) => {
      if(m.update(dt)) {
        newMissiles.push(m);
      }
    });
    this.missiles = newMissiles;
  }

  buildImage(src) {
    let img = new Image();
    img.src = src;
    return img;
  }
}
