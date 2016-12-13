// @flow

const {Level: AbstractLevel} = require("../level_chooser/main");

class Level extends AbstractLevel {
    constructor() {
        super();
    }

    render(
        dt/*: number */,
        ctx/*: CanvasRenderingContext2D */
    ) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    update(
        dt/*: number */
    ) {

    }

    getTitle() {
        return "Creepy Crawler";
    }
}

module.exports = {Level: Level};
