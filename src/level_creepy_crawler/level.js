// @flow

const {Level: AbstractLevel} = require("../level_chooser/main");
const {Map} = require("../map");
const Player = require("../player");
const Gui = require('../gui');
const vector = require('../vector');
const EntityManager = require('../entity-manager');
const mapdata = require('./tileMap');
const img = buildImage('assets/level_creepy_crawler/crawler.png');

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
        this.map = new Map(2, mapdata);
        this.gui = new Gui(this.player);
        this.boss = new Boss(this.player);
        this.em = new EntityManager(this.size.width, this.size.height, 64);
        this.em.addEntity(this.player);
        this.em.addEntity(this.boss.collider);
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
        this.gui.render(dt, ctx);
        this.boss.render(dt, ctx);
    }

    update(
        dt/*: number */
    ) {
        this.player.update(dt);
        this.boss.update(dt);
        this.em.updateEntity(this.player);
        this.em.updateEntity(this.boss.collider);
        this.em.collide();
    }

    getTitle() {
        return "Creepy Crawler";
    }
}

module.exports = {Level: Level};

class Boss {
    /*::
    position: {
        x: number,
        y: number
    }
    player: Player
    renderTick: number
    collider: Collider
    */
    constructor(player) {
        this.player = player;
        this.position = {
            x: 200,
            y: 200
        };
        this.renderTick = 0;
        this.collider = new Collider(this.position, (a)=>null);
    }

    render(
        dt,
        ctx/*: CanvasRenderingContext2D */
    ) {
        ctx.fillRect(this.position.x-60, this.position.y-60, 120, 120);
        this.renderTick += 1;
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.save();
        ctx.rotate(.2*this.renderTick);
        ctx.drawImage(img, -60, -60);
        ctx.restore();
        ctx.translate(0, -40);
        ctx.save();
        ctx.rotate(-.3*this.renderTick);
        ctx.drawImage(img, -60, -60);
        ctx.restore();
        ctx.translate(0, -40);
        ctx.save();
        ctx.rotate(.1*this.renderTick);
        ctx.drawImage(img, -60, -60);
        ctx.restore();
        ctx.restore();
    }

    update(dt) {
        let speed = .04 * dt;
        let norm = vector.scale(vector.normalize(vector.subtract(this.player.position, this.position)), speed);

        this.position.x += norm.x;
        this.position.y += norm.y;
    }
}

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
    constructor(player) {
        this.player = player;
        this.position = {
            x: 200,
            y: 200
        };
        this.renderTick = 0;
        this.collider = new Collider(this.position, (a)=>null);
    }

    render(
        dt,
        ctx/*: CanvasRenderingContext2D */
    ) {
        ctx.fillStyle = "green";
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.size, 0, 2*Math.PI);
		ctx.fill();
    }

    update(dt) {
        let speed = .04 * dt;
        let norm = vector.scale(vector.normalize(vector.subtract(this.player.position, this.position)), speed);

        this.position.x += norm.x;
        this.position.y += norm.y;
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
    constructor(
        position/*: Vector */,
        onCollision/*: (any) */
    ) {
        this.tag = "boss";  // CHECK
        this.position = position;
        this.onCollision = onCollision;
        this.shape = "circle";
        this.points = [
            {x: 0, y: 60},
            {x: 0, y: -60},
            {x: 60, y: 0},
            {x: -60, y: 0}
        ];
    }
}
