// @flow

const {Level: AbstractLevel} = require("../level_chooser/main");
const {Map} = require("../map");
const Player = require("../player");
const mapdata = require('./tileMap');
const {Gui} = require('../gui');


class Level extends AbstractLevel {
    /*::
    player: Player
    map: Map
    gui: Gui
    */
    constructor() {
        super();
        this.player = new Player({x: 500, y: 500});
        this.map = new Map(2, mapdata);
        this.gui = new Gui(this.player);
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
    }

    update(
        dt/*: number */
    ) {
        this.player.update(dt);
    }

    getTitle() {
        return "Creepy Crawler";
    }
}

module.exports = {Level: Level};
