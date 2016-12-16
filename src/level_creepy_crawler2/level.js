// @flow

const {Level: AbstractLevel} = require("../level_chooser/main");
const {Map} = require("../map");
const Player = require("../player");
const Gui = require('../gui');
const vector = require('../vector');
const EntityManager = require('../entity-manager');
const mapdata = require('./tileMap');
const img = buildImage('assets/level_creepy_crawler/crawler.png');

const SQRT = Math.sqrt(2) * 16;

class CollisionEntity {
    /*::
    onCollide: any
    */
    constructor() {

    }
    onCollide(other/*: CollisionEntity */) {

    }
    render(dt, ctx) {

    }
}

class CircleEntity extends CollisionEntity {
    /*::
    x: number
    y: number
    radius: number
    */
    constructor({x, y, radius}/*: {x: number, y: number, radius: number} */) {
        super();
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    render(dt, ctx/*: CanvasRenderingContext2D */) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.stroke();
    }
}
class SquareEntity extends CollisionEntity {
    /*::
    x: number
    y: number
    width: number
    height: number
    */
    constructor(prop/*: {x: number, y: number, width: number, height: number} */) {
        super()
        this.x = prop.x;
        this.y = prop.y;
        this.width = prop.width;
        this.height = prop.height;
    }

    render(dt, ctx) {
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

class CollisionManager {
    /*::
    _actors: CollisionEntity[]
    */
    constructor(actors/*: CollisionEntity[] */) {
        this._actors = actors;
    }
    checkCollisions() {
        for (let i=0; i<this._actors.length; i++) {
            for (let j=i+1; j<this._actors.length; j++) {
                let a = this._actors[i];
                let b = this._actors[j];

                if (a instanceof CircleEntity && b instanceof CircleEntity) {
                    if (this.circleCircle(a, b)) {
                        a.onCollide(b);
                        b.onCollide(a);
                    }
                }
                if (a instanceof CircleEntity && b instanceof CircleEntity) {
                    if (this.circleCircle(a, b)) {
                        a.onCollide(b);
                        b.onCollide(a);
                    }
                }
                if (a instanceof SquareEntity && b instanceof CircleEntity) {
                    if (this.circleSquare(b, a)) {
                        a.onCollide(b);
                        b.onCollide(a);
                    }
                }
                if (a instanceof SquareEntity && b instanceof SquareEntity) {
                    if (this.squareSquare(b, a)) {
                        a.onCollide(b);
                        b.onCollide(a);
                    }
                }
            }
        }
    }
    squareSquare(a/* SquareEntity */, b/*: SquareEntity */) {
        return (a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.height + a.y > b.y)
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
    render(dt, ctx) {
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
    player_collision: SquareEntity
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

    hasWon() {
        return Object.keys(this.boss._chunks).length >= 3;
    }

    start() {
        this.player = new Player({x: 500, y: 500});
        this.player.tag = "";
        this.map = new Map(2, mapdata);
        this.gui = new Gui(this.player);
        this.boss = new Boss(this.player);

        let player = new SquareEntity({x: 10, y: 10, width: 20, height: 40});
        this.player_collision = player;
        player.onCollide = (other) => {
            if (other instanceof SquareEntity) {
                this.player.health = 0;
            }
            if (other instanceof CircleEntity) {
                let diff = vector.normalize(vector.subtract(player, other));
                this.player.position.x += diff.x * 12;
                this.player.position.y += diff.y * 12;
                this.player.health -= 1;
                this.gui.damage();
            }
        }

        this.em = new CollisionManager([
            player,
            new SquareEntity({x: SQRT*24, y: SQRT*4, width: SQRT*6, height: SQRT*6}),
            new SquareEntity({x: SQRT*34, y: SQRT*16, width: SQRT*6, height: SQRT*6}),
            new SquareEntity({x: SQRT*8, y: SQRT*20, width: SQRT*6, height: SQRT*6}),
            this.boss.collider,
        ]);
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
        this.em.render(dt, ctx);
    }

    update(
        dt/*: number */
    ) {
        this.player.update(dt);
        this.player_collision.x = this.player.position.x;
        this.player_collision.y = this.player.position.y;
        this.boss.update(dt);
        this.em.checkCollisions();
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
    collider: CircleEntity
    _chunks: any
    */
    constructor(player) {
        this.player = player;
        this.position = {
            x: 200,
            y: 200
        };
        this.renderTick = 0;
        this.collider = new CircleEntity({x: this.position.x, y: this.position.y, radius: 60});
        this.collider.onCollide = (other) => {
            if (other.width == 20) return;
            if (`${other.x}_${other.y}` in this._chunks) {

            } else {
                this._chunks[`${other.x}_${other.y}`] = {x: other.x, y: other.y};
            }
        };
        this._chunks = {};
    }

    render(
        dt,
        ctx/*: CanvasRenderingContext2D */
    ) {
        this.renderTick += 1;
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        for (let i=0; i<3-Object.keys(this._chunks).length; i++) {
            ctx.save();
            ctx.rotate(.2*this.renderTick);
            ctx.drawImage(img, -60, -60);
            ctx.restore();
            ctx.translate(0, -40);
        }
        ctx.restore();
        for (let value of Object.values(this._chunks)) {
            ctx.save();
            ctx.drawImage(img, value.x, value.y);
            ctx.restore();
        }
    }

    update(dt) {
        let speed = .04 * dt;
        let norm = vector.scale(vector.normalize(vector.subtract(this.player.position, this.position)), speed);

        this.position.x += norm.x;
        this.position.y += norm.y;
        this.collider.x = this.position.x;
        this.collider.y = this.position.y;
    }
}

function buildImage(src) {
    let img = new Image();
    img.src = src;
    return img;
}
