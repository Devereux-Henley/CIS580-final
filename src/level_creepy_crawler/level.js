// @flow

const {Level: AbstractLevel} = require("../level_chooser/main");
const {Map} = require("../map");
const Player = require("../player");
const mapdata = require('./tileMap');
const {Gui} = require('../gui');
const vector = require('../vector');
const img = buildImage('assets/level_creepy_crawler/crawler.png');


class Level extends AbstractLevel {
    /*::
    player: Player
    map: Map
    gui: Gui
    boss: Boss
    */
    constructor() {
        super();
    }

    start() {
        this.player = new Player({x: 500, y: 500});
        this.map = new Map(2, mapdata);
        this.gui = new Gui(this.player);
        this.boss = new Boss(this.player);
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
    */
    constructor(player) {
        this.player = player;
        this.position = {
            x: 200,
            y: 200
        };
        this.renderTick = 0;
    }

    render(
        dt,
        ctx/*: CanvasRenderingContext2D */
    ) {
        // ctx.fillRect(this.position.x-60, this.position.y-60, 120, 120);
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
