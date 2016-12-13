// @flow

const {Level: AbstractLevel} = require("../level_chooser/main");
const Player = require("../player");


class Level extends AbstractLevel {
    /*::
    player: Player
    */
    constructor() {
        super();
        this.player = new Player({x: 500, y: 500});
    }

    render(
        dt/*: number */,
        ctx/*: CanvasRenderingContext2D */
    ) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.player.render(dt, ctx);
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
