// @flow

const {Level: AbstractLevel} = require("./level_chooser/main");
const {Map} = require("./map");
const Player = require("./player");
const Gui = require('./gui');
const vector = require('./vector');
const EntityManager = require('./entity-manager');
const mapdata = require('../assets/map/bossmap1');
const img = buildImage('assets/level_creepy_crawler/crawler.png');

const BLOB_TAG = "boss";
const BLOB_SHAPE = "circle";
const BLOB_RADIUS = 128;

const BOSS_SIZE = 32;
const BOSS_SPEED = 2;

/*::
import type {Vector} from "../vector";
*/

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
        this.player = new Player({x: 500, y: 500});
        this.map = new Map(1, mapdata);
        //this.gui = new Gui(this.player);
        this.boss = new ElBlobbo(this.player, 4);
        this.em = new EntityManager(this.size.width, this.size.height, 64);
        this.em.addEntity(this.player);
        this.em.addEntity(this.boss);
    }

    render(
        dt/*: number */,
        ctx/*: CanvasRenderingContext2D */
    ) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        for (let layer of this.map.getLayers()) {
            layer.render(ctx);
        }
        this.player.render(dt, ctx);
        //this.gui.render(dt, ctx);
		//console.log("before");
        this.boss.render(dt, ctx);
		//.log("after");
    }

    update(
        dt/*: number */
    ) {
        this.player.update(dt);
        this.boss.update(dt);
        this.em.updateEntity(this.player);
        this.em.updateEntity(this.boss);
        this.em.collide();
    }

    getTitle() {
        return "El Blobbo";
    }
}

module.exports = {Level: Level};

class ElBlobbo {
    /*::
    position: {
        x: number,
        y: number
    }
    player: Player
    renderTick: number
    collider: Collider
    */
    constructor(player, size) {
        this.player = player;
        this.gui = new Gui(this.player);
        this.position = {
            x: 200,
            y: 200
        };
        this.renderTick = 0;


		this.size = BOSS_SIZE * size;
		this.speed = BOSS_SPEED;
		this.tag = "boss";
		this.shape = BLOB_SHAPE;
		this.radius = this.size;
		this.velocity = {x: 0, y: 0};
		this.immune = false;
    }

    render(
        dt,
        ctx/*: CanvasRenderingContext2D */
    ) {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
  		ctx.fillStyle = "green";
  		ctx.beginPath();
  		ctx.arc(0, 0, this.size / 2, 0, 2*Math.PI);
  		ctx.fill();
      ctx.restore();

      this.gui.render(dt, ctx);
    }

    update(dt) {
        let speed = .04 * dt;
        let norm = vector.scale(vector.normalize(vector.subtract(this.player.position, this.position)), speed);

        this.position.x += norm.x;
        this.position.y += norm.y;
    }
    onCollision(entity) {
      //console.log("here!");
      switch(entity.tag) {
        case "player":
          this.bounce();
          this.gui.damage();
          break;
        default:
          break;
      }
    }

    // Bounce functionallity when hit to avoid being double-tapped. -WIP
    bounce() {
      /*if(this.player.position.x > this.position.x && this.player.position.y > this.position.y){
        this.player.position.x -= 30;
        this.player.position.y -= 30;
      }
      else if(this.player.position.x < this.position.x && this.player.position.y > this.position.y){
        this.player.position.x += 30;
        this.player.position.y += 30;
      }
      else if(this.player.position.y > this.position.y && this.player.position.x < this.position.x){
        this.player.position.x += 30;
        this.player.position.y += 30;
      }
      else if(this.player.position.y < this.position.y && this.player.position.x > this.position.x){
        this.player.position.x -= 30;
        this.player.position.y -= 30;
      }*/
      if(this.player.position.x > this.position.x){
        this.player.position.x += 30;
      }
      if(this.player.position.x < this.position.x){
        this.player.position.x -= 30;
      }
      if(this.player.position.y > this.position.y){
        this.player.position.x -= 30;
      }
      if(this.player.position.x < this.position.x){
        this.player.position.x += 30;
      }

    }
}

function buildImage(src) {
    let img = new Image();
    img.src = src;
    return img;
}
