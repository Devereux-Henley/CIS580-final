// @flow

const {Level: AbstractLevel} = require("../level_chooser/main");
const {Map} = require("../map");
const Player = require("../player");
const {Gui} = require('../gui');
const vector = require('../vector');
const EntityManager = require('../entity-manager');
const mapdata = require('./tileMap');
const img = buildImage('assets/level_creepy_crawler/crawler.png');

const SQRT = Math.sqrt(2) * 16;

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

class CollisionEntity {
    constructor() {

    }
    onCollide() {

    }
}

class CircleEntity extends CollisionEntity {
    /*::
    x: number
    y: number
    radius: number
    */
}
class SquareEntity extends CollisionEntity {
    /*::
    x: number
    y: number
    width: number
    height: number
    */
}

class CollisionManager {
    /*::
    _actors: CollisionEntity[]
    */
    constructor() {
        this._actors = [];
    }
    checkCollisions() {
        for (let i=0; i<this._actors.length; i++) {
            for (let j=i+1; j<this._actors.length; j++) {
                let a = this._actors[i];
                let b = this._actors[j];

                if (a.constructor == CircleEntity && b.constructor == CircleEntity) {
                    if (this.circleCircle(a, b)) {
                        a.onCollide(b);
                        b.onCollide(a);
                    }
                }
                if (a.constructor == CircleEntity && b.constructor == SquareEntity) {
                    if (this.circleCircle(a, b)) {
                        a.onCollide(b);
                        b.onCollide(a);
                    }
                }
                if (a.constructor == SquareEntity && b.constructor == CircleEntity) {
                    if (this.circleSquare(c, r)) {
                        a.onCollide(b);
                        b.onCollide(a);
                    }
                }
            }
        }
    }
    squareSquare(a/* SquareEntity */, b/*: SquareEntity */) {
        return false;
    }
    circleSquare(c/*: CircleEntity */, r/*: SquareEntity */) {
        let cx = Math.abs(c.x - r.x - r.width/2);
        let xDist = r.width/2 + c.radius;
        if (cx > xDist)
            return false;
        let cy = Math.abs(c.y - r.y - r.height/2);
        let yDist = r.height/2 + c.radius;
        if (cy > yDist)
            return false;
        if (cx <= r.width/2 || cy <= r.height/2)
            return true;
        let xCornerDist = cx - r.width/2;
        let yCornerDist = cy - r.height/2;
        let xCornerDistSq = xCornerDist * xCornerDist;
        let yCornerDistSq = yCornerDist * yCornerDist;
        let maxCornerDistSq = c.radius * c.radius;
        return xCornerDistSq + yCornerDistSq <= maxCornerDistSq;
    }
    circleCircle(a/*: CircleEntity */, b/*: CircleEntity */) {
        return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) < Math.pow(a.radius + b.radius, 2);
    }
}

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

    hasEnded() {
        return this.player.health <= 0;
    }

    start() {
        this.player = new Player({x: 500, y: 500});
        this.player.tag = "";
        this.map = new Map(2, mapdata);
        this.gui = new Gui(this.player);
        this.boss = new Boss(this.player);

        this.em = new EntityManager(this.size.width, this.size.height, 64);
        this.em.addEntity(this.player);
        this.em.addEntity(this.boss.collider);
        this.em.addEntity(new Collider({x: 24*SQRT, y: 4*SQRT}, (a)=>console.log("asdf")))
        this.em.addEntity(new Collider({x: 34*SQRT, y: 16*SQRT}, (a)=>console.log("asdf")))
        this.em.addEntity(new Collider({x: 8*SQRT, y: 20*SQRT}, (a)=>console.log("asdf")))
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
        this.collider = new Collider(this.position, debounce((a)=>{this.player.health--}, 50, true));
    }

    render(
        dt,
        ctx/*: CanvasRenderingContext2D */
    ) {
        ctx.fillStyle = 'green';
        ctx.fillRect(SQRT*24, SQRT*4, SQRT*6, SQRT*6);
        ctx.fillRect(SQRT*34, SQRT*16, SQRT*6, SQRT*6);
        ctx.fillRect(SQRT*8, SQRT*20, SQRT*6, SQRT*6);

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
        this.tag = "asdf";
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

class ClassPitCollider extends Collider {
    constructor(
        position,
        onCollision
    ) {
        super(position, onCollision);
        this.shape = "square";
        this.points = [
            {x: 0, y: 0},
            {x: 6*SQRT, y: 0},
            {x: 0, y: 6*SQRT},
            {x: 6*SQRT, y: 6*SQRT}
        ]
    }
}
