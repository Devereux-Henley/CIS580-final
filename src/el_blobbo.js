// @flow

const {Level: AbstractLevel} = require("./level_chooser/main");
const {Map} = require("./map");
const Player = require("./player");
const Spike = require("./spike");
const Trigger = require("./trigger");
const Gui = require('./gui');
const vector = require('./vector');
const EntityManager = require('./entity-manager');
const SpawnManager = require('./spawnManager');
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
    constructor(size) {
        super();
        this.size = size;
    }

    start() {
        this.player = new Player({x: 500, y: 500});
        this.map = new Map(1, mapdata);
        this.gui = new Gui(this.player);
        this.boss = new ElBlobbo(this.player, 4);
        this.em = new EntityManager(this.size.width, this.size.height, 64);
        this.em.addEntity(this.player);
        this.em.addEntity(this.boss);

        // this.spikes = [];
        this.spawnManager = new SpawnManager();
        let spikeSpawner = {
          new: function(obj) {
            return new Spike({x: obj.x, y: obj.y});
          }
        };
        let triggerSpawner = {
          new: function(obj) {
            return new Trigger({x: obj.x, y: obj.y});
          }
        }
        this.spawnManager.addAssociation("Spike", spikeSpawner);
        this.spawnManager.addAssociation("Trigger", triggerSpawner);
        this.spawnManager.getLocations(this.map.objlayers);

        // Add Trigger to EM
        this.trigger = this.spawnManager.objects[4];
        this.em.addEntity(this.trigger);
    }

    render(dt, ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        for (let layer of this.map.getLayers()) {
            layer.render(ctx);
        }
        this.spawnManager.render(dt, ctx);
        this.player.render(dt, ctx);
        this.gui.render(dt, ctx);
        this.boss.render(dt, ctx);
    }

    onCollision(entity) {
      switch(entity.tag) {
        case "player":
          gui.damage();
          break;
      }
    }

    update(dt) {
        this.player.update(dt);
        this.boss.update(dt);
        this.spawnManager.update(dt);
        this.em.updateEntity(this.player);
        this.em.updateEntity(this.boss);
        this.em.updateEntity(this.trigger);
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
        this.position = {
            x: 200,
            y: 200,
            radius: 128
        };
        this.circle = this.position;
        this.renderTick = 0;
        this.collider = new Collider(this.position, (a)=>null);
    		this.size = BOSS_SIZE * size;
    		this.speed = BOSS_SPEED;
    		this.tag = "boss";
    		this.shape = BLOB_SHAPE;
    		this.radius = this.size;
    		this.velocity = {x: 0, y: 0};
    		this.immune = false;
    }

    render(dt, ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
    		ctx.fillStyle = "green";
    		ctx.beginPath();
    		ctx.arc(0, 0, this.size / 2, 0, 2*Math.PI);
    		ctx.fill();
        ctx.restore();
    }

    update(dt) {
        let speed = .04 * dt;
        let norm = vector.scale(vector.normalize(vector.subtract(this.player.position, this.position)), speed);

        this.position.x += norm.x;
        this.position.y += norm.y;
    }

    onCollision(entity) {

    }
}

function buildImage(src) {
    let img = new Image();
    img.src = src;
    return img;
}


class Collider {
    /*::
    shape: "square" | "circle" | "complex"
    tag: string
    position: Vector
    points: Vector[]
    onCollision: (any)
    */
    constructor(position, onCollision) {
        this.tag = BLOB_TAG;  // CHECK
        this.position = position;
        this.onCollision = onCollision;
        this.shape = BLOB_SHAPE;
        this.radius = BLOB_RADIUS;
        this.points = [
            {x: 0, y: 60},
            {x: 0, y: -60},
            {x: 60, y: 0},
            {x: -60, y: 0}
        ];
    }
}
